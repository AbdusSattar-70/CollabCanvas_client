import { useContext, useDebugValue } from "react";
import BoardContext from "../context/BoardProvider";

const useJoinedUsers = () => {
    const { joinedUsers } = useContext(BoardContext);
    useDebugValue(joinedUsers, joinedUsers => joinedUsers?.boardId ? "connected" : "disconnected")
    return useContext(BoardContext);
}

export default useJoinedUsers;