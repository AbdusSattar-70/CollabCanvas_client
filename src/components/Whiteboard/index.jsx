import { useState, useEffect, useRef } from "react";
import { Stage } from "react-konva";
import { COLORS, TOOL_ITEMS } from "../../utils/constants";
import Menu from "../Menu";
import DrawingShapeAndTool from "../DrawingShapeAndTool/DrawingShapeAndTool";
import { socket } from "../../utils/socket";
import useBoard from "../../hooks/useBoard";

// const ADMIN = "ADMIN";
const EVENT = {
  DRAW: "draw",
  REDO: "redo",
  UNDO: "undo",
  CLEAR: "clear",
  ACTIVITY: "activity",
  ENTERROOM: "enterRoom",
  NOTIFY: "notify",
  USERLIST: "userList",
  ROOMLIST: "roomList",
  MOUSEUP: "mouseup",
};

const WhiteBoard = () => {
  const { board } = useBoard();
  const isDrawing = useRef(false);
  const drawingTimeout = useRef();
  const undoRedoTimeout = useRef();

  const [tool, setTool] = useState(TOOL_ITEMS.PENCIL);
  const [lines, setLines] = useState([]);
  const [currentColor, setCurrentColor] = useState(COLORS.BASIC);
  const [previousColor, setPreviousColor] = useState(COLORS.BASIC);
  const [redoStack, setRedoStack] = useState([]);
  const [brushSize, setBrushSize] = useState(1);

  useEffect(() => {
    socket.on(EVENT.DRAW, (data) => {
      setLines(data.lines);
    });

    socket.on(EVENT.UNDO, (data) => {
      const undoneLine = data.line;
      setRedoStack([...redoStack, undoneLine]);
      setLines((prevLines) => prevLines.slice(0, -1));
    });

    socket.on(EVENT.REDO, (data) => {
      const redoneLine = data.line;
      setLines([...lines, redoneLine]);
      setRedoStack((prevRedoStack) => prevRedoStack.slice(0, -1));
    });

    socket.on(EVENT.CLEAR, () => {
      setLines([]);
      setRedoStack([]);
    });

    return () => {
      socket.off(EVENT.DRAW);
      socket.off(EVENT.UNDO);
      socket.off(EVENT.REDO);
      socket.off(EVENT.CLEAR);
    };
  }, [lines, redoStack, socket]);

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

    // Clear existing timeouts when starting a new drawing
    clearTimeout(drawingTimeout.current);
    clearTimeout(undoRedoTimeout.current);
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

    // Set a timeout to emit the "draw" event after a delay
    drawingTimeout.current = setTimeout(() => {
      socket.emit(EVENT.DRAW, { lines });
    }, 1000);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleToolChange = (selectedTool) => {
    if (selectedTool === TOOL_ITEMS.ERASER) {
      // Save the current color before switching to eraser
      setPreviousColor(currentColor);
      setCurrentColor(COLORS.WHITE);
    } else {
      // Switching back to pencil, restore the previous color
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

      // Emit undo event after a delay
      undoRedoTimeout.current = setTimeout(() => {
        socket.emit(EVENT.UNDO, { line: undoneLine });
      }, 1000);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const redoneLine = redoStack[redoStack.length - 1];
      setLines([...lines, redoneLine]);
      setRedoStack((prevRedoStack) => prevRedoStack.slice(0, -1));

      // Emit redo event after a delay
      undoRedoTimeout.current = setTimeout(() => {
        socket.emit(EVENT.REDO, { line: redoneLine });
      }, 1000);
    }
  };

  const handleClear = () => {
    setLines([]);
    setRedoStack([]);

    // Clear existing timeouts when clearing the board
    clearTimeout(drawingTimeout.current);
    clearTimeout(undoRedoTimeout.current);

    // Emit clear event
    socket.emit(EVENT.CLEAR);
  };

  const handleBrushSize = (size) => {
    setBrushSize(parseInt(size, 10));
  };

  useEffect(() => {
    document.addEventListener(EVENT.MOUSEUP, handleMouseUp);
    return () => {
      document.removeEventListener(EVENT.MOUSEUP, handleMouseUp);
    };
  }, []);

  return (
    <div>
      <Menu
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
        id="stage"
        className="cursor-grabbing"
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        <DrawingShapeAndTool lines={lines} />
      </Stage>
    </div>
  );
};

export default WhiteBoard;
