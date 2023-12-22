import { createContext, useState } from "react";
import PropTypes from "prop-types";

const BoardContext = createContext({});

export const BoardProvider = ({ children }) => {
  const [joinedUsers, setJoinedUsers] = useState({ boards: {} });

  return (
    <BoardContext.Provider value={{ joinedUsers, setJoinedUsers }}>
      {children}
    </BoardContext.Provider>
  );
};

BoardProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default BoardContext;
