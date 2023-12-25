const COLORS = {
    BASIC: "#EF0BC5",
    WHITE: '#FFFFFF'
}
 const TOOL_ITEMS = {
    PENCIL: "PENCIL",
    STAR: "STAR",
    RECT: "RECT",
    CIRCLE: "CIRCLE",
    ERASER: "ERASER",
    DOWNLOAD: "DOWNLOAD",
    TEXT: 'TEXT'
  };

const SOCKET_EVENT = {
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
  FETCH:'fetch'
};

export {COLORS, TOOL_ITEMS,SOCKET_EVENT}