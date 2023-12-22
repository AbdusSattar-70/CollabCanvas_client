import { useContext, useDebugValue } from "react";
import BoardContext from "../context/BoardProvider";

const useBoard = () => {
    const { board } = useContext(BoardContext);
    useDebugValue(board, board => board?.boardId ? "connected" : "disconnected")
    return useContext(BoardContext);
}

export default useBoard;