import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { Stage } from "react-konva";
import { COLORS, TOOL_ITEMS, SOCKET_EVENT } from "../../utils/constants";
import Menu from "../Menu";
import DrawingShapeAndTool from "../DrawingShapeAndTool/DrawingShapeAndTool";
import { socket } from "../../utils/socket";
import useJoinedUsers from "../../hooks/useJoinedUsers";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { fetchData, updateBoard } from "../../api/fetchData";
import pako from "pako";

const WhiteBoard = () => {
  const stageRef = useRef();
  const { id } = useParams();
  const { joinedUser } = useJoinedUsers();
  const isDrawing = useRef(false);
  const drawingTimeout = useRef();
  const undoRedoTimeout = useRef();

  const [tool, setTool] = useState(TOOL_ITEMS.PENCIL);
  const [lines, setLines] = useState([]);
  const [currentColor, setCurrentColor] = useState(COLORS.BASIC);
  const [previousColor, setPreviousColor] = useState(COLORS.BASIC);
  const [redoStack, setRedoStack] = useState([]);
  const [brushSize, setBrushSize] = useState(1);
  const [activeUsers, setActiveUsers] = useState([]);
  const [roomList, setRoomList] = useState([]);

  const fetchPreviousLines = useCallback(async () => {
    try {
      const res = await fetchData.get(`boards/${id}`);
      setLines((prevLines) => [...prevLines, ...res.data[0].lines]);
    } catch (error) {
      console.error("Error fetching previous lines:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchPreviousLines();
  }, [fetchPreviousLines]);

  useLayoutEffect(() => {
    socket.emit(SOCKET_EVENT.ENTERROOM, { name: joinedUser.name, room: id });

    const handleDraw = (data) => {
      if (!handleDraw.timeoutId) {
        handleDraw.timeoutId = setTimeout(() => {
          const restored = JSON.parse(pako.inflate(data, { to: "string" }));
          setLines((prev) => [...prev, ...restored]);
          handleDraw.timeoutId = null;
        }, 10);
      }
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

    const handleUserList = (data) => {
      setActiveUsers(data.users);
    };

    const handleRoomList = (data) => {
      setRoomList((prev) => [...prev, ...data.rooms]);
    };

    socket.on(SOCKET_EVENT.DRAW, handleDraw);
    socket.on(SOCKET_EVENT.UNDO, handleUndo);
    socket.on(SOCKET_EVENT.REDO, handleRedo);
    socket.on(SOCKET_EVENT.CLEAR, handleClear);
    socket.on(SOCKET_EVENT.USERLIST, handleUserList);
    socket.on(SOCKET_EVENT.ROOMLIST, handleRoomList);

    return () => {
      socket.off(SOCKET_EVENT.ENTERROOM);
      socket.off(SOCKET_EVENT.DRAW, handleDraw);
      socket.off(SOCKET_EVENT.UNDO, handleUndo);
      socket.off(SOCKET_EVENT.REDO, handleRedo);
      socket.off(SOCKET_EVENT.CLEAR, handleClear);
      socket.off(SOCKET_EVENT.USERLIST, handleUserList);
      socket.off(SOCKET_EVENT.ROOMLIST, handleRoomList);
    };
  }, [id, joinedUser, redoStack]);

  useEffect(() => {
    const handleNotify = ({ text }) => {
      toast.info(`${text}`);
    };

    socket.once(SOCKET_EVENT.NOTIFY, handleNotify);

    return () => {
      socket.off(SOCKET_EVENT.NOTIFY, handleNotify);
    };
  }, []);

  useEffect(() => {
    const handleFetch = (data) => {
      const restored = JSON.parse(pako.inflate(data, { to: "string" }));
      setLines((prev) => [...prev, ...restored]);
    };

    socket.on(SOCKET_EVENT.FETCH, handleFetch);

    return () => {
      socket.off(SOCKET_EVENT.FETCH, handleFetch);
    };
  }, []);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    const newLine = {
      tool,
      points: [pos.x, pos.y],
      color: currentColor,
      brushSize,
    };

    setLines((prevLines) => [...prevLines, newLine]);
    setRedoStack([]);

    clearTimeout(drawingTimeout.current);
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDrawing.current) return;

      const pos = e.target.getStage().getPointerPosition();
      const lastLine = { ...lines[lines.length - 1] };

      setLines((prevLines) => {
        if (tool === TOOL_ITEMS.PENCIL || tool === TOOL_ITEMS.ERASER) {
          lastLine.points = lastLine.points.concat([pos.x, pos.y]);
        } else {
          lastLine.points[2] = pos.x;
          lastLine.points[3] = pos.y;
        }
        return [...prevLines.slice(0, -1), lastLine];
      });

      clearTimeout(drawingTimeout.current);
      drawingTimeout.current = setTimeout(
        () => {
          const lastSegment = lines.slice(-1);
          const compressedLines = pako.deflate(JSON.stringify(lastSegment));
          socket.emit(SOCKET_EVENT.DRAW, compressedLines);
        },
        tool === TOOL_ITEMS.RECT ? 1000 : 10
      );
    },
    [drawingTimeout, lines, tool]
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

  const handleToolChange = (selectedTool) => {
    if (selectedTool === TOOL_ITEMS.ERASER) {
      setPreviousColor(currentColor);
      setCurrentColor(COLORS.WHITE);
    } else {
      setCurrentColor(previousColor);
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

  const getCursorStyle = (currentTool) => {
    switch (currentTool) {
      case TOOL_ITEMS.PENCIL:
        return "url(pencil-cursor.png), auto";
      case TOOL_ITEMS.ERASER:
        return "url(eraser-cursor.png), auto";
      case TOOL_ITEMS.RECT:
        return "crosshair";
      case TOOL_ITEMS.CIRCLE:
        return "crosshair";
      default:
        return "auto";
    }
  };

  return (
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
  );
};

export default WhiteBoard;
