import { useContext } from "react";
import BoardContext from "../context/BoardProvider";

const useJoinedUsers = () => {
    return useContext(BoardContext);
}

export default useJoinedUsers;