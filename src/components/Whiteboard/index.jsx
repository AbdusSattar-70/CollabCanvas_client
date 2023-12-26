import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Stage } from "react-konva";
import { COLORS, TOOL_ITEMS, SOCKET_EVENT } from "../../utils/constants";
import Menu from "../Menu";
import DrawingShapeAndTool from "../DrawingShapeAndTool/DrawingShapeAndTool";
import { socket } from "../../utils/socket";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { updateBoard } from "../../api/fetchData";
import * as ComlinkWorker from "comlink";
import { getCursorStyle } from "../../utils/cursor";

const WhiteBoard = () => {
  const worker = useMemo(
    () => new ComlinkWorker(new URL("./worker.js", import.meta.url), {}),
    []
  );
  const [loading, setLoading] = useState(true);
  const fetchOnceRender = useRef(false);
  const stageRef = useRef();
  const { id, name } = useParams();
  const isDrawing = useRef(false);
  const drawingTimeout = useRef();
  const undoRedoTimeout = useRef();

  const [tool, setTool] = useState(TOOL_ITEMS.PENCIL);
  const [lines, setLines] = useState([]);
  const [currentColor, setCurrentColor] = useState(COLORS.BASIC);
  const [previousColor, setPreviousColor] = useState(COLORS.BASIC);
  const [redoStack, setRedoStack] = useState([]);
  const [fillMode, setFillMode] = useState(TOOL_ITEMS.TRANSPARENT);
  const [brushSize, setBrushSize] = useState(1);
  const [activeUsers, setActiveUsers] = useState([]);
  const [roomList, setRoomList] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchPrevLines = async () => {
      try {
        const res = await worker.fetchPreviousLines(id);
        console.log(res);
        if (isMounted) {
          setLines((prevLines) => [...prevLines, ...res]);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching previous lines:", error);
      }
    };

    if (!fetchOnceRender.current) {
      fetchOnceRender.current = true;
      fetchPrevLines();
    }

    const handleDraw = async (data) => {
      const decomData = await worker.restored(data);
      setLines((prev) => [...prev, ...decomData]);
    };

    const handleUndo = (data) => {
      const undoneLine = data.line;
      setRedoStack([...redoStack, undoneLine]);
      setLines((prevLines) => prevLines.slice(0, -1));
    };

    const handleRedo = (data) => {
      const redoneLine = data.line;
      setLines((prevLines) => [...prevLines, redoneLine]);
      setRedoStack((prevRedoStack) => prevRedoStack.slice(0, -1));
    };

    const handleClear = () => {
      setLines([]);
      setRedoStack([]);
    };

    socket.on(SOCKET_EVENT.DRAW, handleDraw);
    socket.on(SOCKET_EVENT.UNDO, handleUndo);
    socket.on(SOCKET_EVENT.REDO, handleRedo);
    socket.on(SOCKET_EVENT.CLEAR, handleClear);

    return () => {
      isMounted = false;
      socket.off(SOCKET_EVENT.DRAW, handleDraw);
      socket.off(SOCKET_EVENT.UNDO, handleUndo);
      socket.off(SOCKET_EVENT.REDO, handleRedo);
      socket.off(SOCKET_EVENT.CLEAR, handleClear);
    };
  }, [id, redoStack, worker]);

  useEffect(() => {
    const handleUserList = (data) => {
      setActiveUsers(data.users);
    };

    const handleRoomList = (data) => {
      setRoomList((prev) => [...prev, ...data.rooms]);
    };

    const handleNotify = ({ text }) => {
      toast.info(`${text}`);
    };

    socket.emit(SOCKET_EVENT.ENTERROOM, { name, room: id });
    socket.once(SOCKET_EVENT.USERLIST, handleUserList);
    socket.once(SOCKET_EVENT.ROOMLIST, handleRoomList);
    socket.on(SOCKET_EVENT.NOTIFY, handleNotify);

    return () => {
      socket.off(SOCKET_EVENT.ENTERROOM);
      socket.off(SOCKET_EVENT.USERLIST, handleUserList);
      socket.off(SOCKET_EVENT.ROOMLIST, handleRoomList);
      socket.off(SOCKET_EVENT.NOTIFY, handleNotify);
    };
  }, [id, name]);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    const newLine = {
      tool,
      points: [pos.x, pos.y],
      color: currentColor,
      brushSize,
      fillMode,
      draggable: true,
    };

    setLines((prevLines) => [...prevLines, newLine]);
    setRedoStack([]);

    clearTimeout(drawingTimeout.current);
  };

  const senddrawingEmit = useCallback(() => {
    clearTimeout(drawingTimeout.current);
    drawingTimeout.current = setTimeout(
      async () => {
        const lastSegment = lines.slice(-1);
        const compressedData = await worker.compressed(lastSegment);
        socket.emit(SOCKET_EVENT.DRAW, compressedData);
      },
      tool === TOOL_ITEMS.RECT ||
        tool === TOOL_ITEMS.CIRCLE ||
        tool === TOOL_ITEMS.STAR
        ? 1000
        : 10
    );
  }, [lines, tool, worker]);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDrawing.current) return;

      const pos = e.target.getStage().getPointerPosition();
      const lastLine = { ...lines[lines.length - 1] };

      setLines((prevLines) => {
        if (tool === TOOL_ITEMS.PENCIL || tool === TOOL_ITEMS.ERASER) {
          lastLine.points = lastLine.points.concat([pos.x, pos.y]);
        } else if (lastLine.draggable) {
          lastLine.points[2] = pos.x;
          lastLine.points[3] = pos.y;
        } else {
          // Handle other non-draggable shapes
          lastLine.points[2] = pos.x;
          lastLine.points[3] = pos.y;
        }
        return [...prevLines.slice(0, -1), lastLine];
      });
      senddrawingEmit();
    },
    [lines, tool, senddrawingEmit]
  );

  const handleStoreBoardData = async () => {
    const uri = stageRef.current.toDataURL();
    const updated = await updateBoard(id, lines, uri);
    if (updated.status === 200) {
      toast.info("Stored Success");
    } else {
      toast.warning("Oops, something went wrong, please try again");
    }
  };

  const handleToolChange = (selectedTool, newFill = null) => {
    if (selectedTool === TOOL_ITEMS.ERASER) {
      setPreviousColor(currentColor);
      setCurrentColor(COLORS.WHITE);
    } else {
      setCurrentColor(previousColor);
      setFillMode((prevFillMode) =>
        prevFillMode === newFill ? TOOL_ITEMS.TRANSPARENT : TOOL_ITEMS.FILL
      );
    }

    setTool(selectedTool);
  };

  const handleColorChange = (newColor) => {
    setCurrentColor(newColor);
  };

  const handleUndo = useCallback(() => {
    if (lines.length > 0) {
      const undoneLine = { ...lines[lines.length - 1] };
      setRedoStack((prevRedoStack) => [...prevRedoStack, undoneLine]);
      setLines((prevLines) => prevLines.slice(0, -1));

      undoRedoTimeout.current = setTimeout(() => {
        socket.emit(SOCKET_EVENT.UNDO, { line: undoneLine });
      }, 1000);
    }
  }, [lines]);

  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      const redoneLine = { ...redoStack[redoStack.length - 1] };
      setLines((prevLines) => [...prevLines, redoneLine]);
      setRedoStack((prevRedoStack) => prevRedoStack.slice(0, -1));

      undoRedoTimeout.current = setTimeout(() => {
        socket.emit(SOCKET_EVENT.REDO, { line: redoneLine });
      }, 1000);
    }
  }, [redoStack]);

  const handleClear = () => {
    setLines([]);
    setRedoStack([]);

    clearTimeout(drawingTimeout.current);
    clearTimeout(undoRedoTimeout.current);

    socket.emit(SOCKET_EVENT.CLEAR);
  };

  const handleBrushSize = (size) => {
    setBrushSize(parseInt(size, 10));
  };

  useEffect(() => {
    const handleMouseUp = () => {
      isDrawing.current = false;
    };
    document.addEventListener(SOCKET_EVENT.MOUSEUP, handleMouseUp);
    return () => {
      document.removeEventListener(SOCKET_EVENT.MOUSEUP, handleMouseUp);
    };
  }, []);

  return (
    <>
      {loading ? (
        <p>looading</p>
      ) : (
        <>
          <Menu
            stageRef={stageRef}
            handleStoreBoardData={handleStoreBoardData}
            activeUsers={activeUsers}
            roomList={roomList}
            currentColor={currentColor}
            brushSize={brushSize}
            handleToolChange={handleToolChange}
            handleBrushSize={handleBrushSize}
            fillMode={fillMode}
            handleRedo={handleRedo}
            handleUndo={handleUndo}
            handleClear={handleClear}
            handleColorChange={handleColorChange}
          />
          <Stage
            ref={stageRef}
            style={{ cursor: getCursorStyle(tool) }}
            width={window.innerWidth}
            height={window.innerHeight}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
          >
            <DrawingShapeAndTool lines={lines} />
          </Stage>
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar
          />
        </>
      )}
    </>
  );
};

export default WhiteBoard;
