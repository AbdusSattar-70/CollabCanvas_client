import { useState, useEffect, useRef } from "react";
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

  useEffect(() => {
    const fetchPreviousLines = async (id) => {
      try {
        const res = await fetchData.get(`boards/${id}`);
        setLines((prevLines) => [...prevLines, ...res.data[0].lines]);
      } catch (error) {
        console.error("Error fetching previous lines:", error);
      }
    };

    fetchPreviousLines(id);
  }, [id]);

  useEffect(() => {
    socket.emit(SOCKET_EVENT.ENTERROOM, { name: joinedUser.name, room: id });

    const handleDraw = (data) => {
      const restored = JSON.parse(pako.inflate(data, { to: "string" }));
      setLines((prev) => [...prev, ...restored]);
    };

    const handleUndo = (data) => {
      const undoneLine = data.line;
      setRedoStack([...redoStack, undoneLine]);
      setLines((prevLines) => prevLines.slice(0, -1));
    };

    const handleRedo = (data) => {
      const redoneLine = data.line;
      setLines([...lines, redoneLine]);
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
  }, []);

  useEffect(() => {
    const handleFetch = (data) => {
      const restored = JSON.parse(pako.inflate(data, { to: "string" }));
      setLines((prev) => [...prev, ...restored]);
    };

    const handleNotify = ({ text }) => {
      toast.info(`${text}`);
    };

    socket.on(SOCKET_EVENT.FETCH, handleFetch);
    socket.on(SOCKET_EVENT.NOTIFY, handleNotify);

    return () => {
      socket.off(SOCKET_EVENT.FETCH, handleFetch);
      socket.off(SOCKET_EVENT.NOTIFY, handleNotify);
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

    setLines([...lines, newLine]);
    setRedoStack([]);

    clearTimeout(drawingTimeout.current);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;

    const pos = e.target.getStage().getPointerPosition();
    let lastLine = lines[lines.length - 1];

    setLines((prevLines) => {
      if (tool === TOOL_ITEMS.PENCIL || tool === TOOL_ITEMS.ERASER) {
        lastLine.points = lastLine.points.concat([pos.x, pos.y]);
      } else {
        lastLine.points[2] = pos.x;
        lastLine.points[3] = pos.y;
      }
      return [...prevLines.slice(0, -1), lastLine];
    });

    drawingTimeout.current = setTimeout(() => {
      const compressedLines = pako.deflate(JSON.stringify(lines));
      socket.emit(SOCKET_EVENT.DRAW, compressedLines);
    }, 500);
  };

  const handleStoreBoardData = async () => {
    const uri = stageRef.current.toDataURL();
    const updated = await updateBoard(id, lines, uri);
    if (updated.status === 200) {
      toast.info("Stored Success");
    } else {
      toast.warning("Opps,something went wrong,please try again");
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
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

  const handleUndo = () => {
    if (lines.length > 0) {
      const undoneLine = lines[lines.length - 1];
      setRedoStack([...redoStack, undoneLine]);
      setLines((prevLines) => prevLines.slice(0, -1));

      undoRedoTimeout.current = setTimeout(() => {
        socket.emit(SOCKET_EVENT.UNDO, { line: undoneLine });
      }, 1000);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const redoneLine = redoStack[redoStack.length - 1];
      setLines([...lines, redoneLine]);
      setRedoStack((prevRedoStack) => prevRedoStack.slice(0, -1));

      undoRedoTimeout.current = setTimeout(() => {
        socket.emit(SOCKET_EVENT.REDO, { line: redoneLine });
      }, 1000);
    }
  };

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
    document.addEventListener(SOCKET_EVENT.MOUSEUP, handleMouseUp);
    return () => {
      document.removeEventListener(SOCKET_EVENT.MOUSEUP, handleMouseUp);
    };
  }, []);

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
        className="cursor-grabbing"
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
