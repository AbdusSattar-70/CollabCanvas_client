import { TOOL_ITEMS } from "./constants";

 export const getCursorStyle = (currentTool) => {
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