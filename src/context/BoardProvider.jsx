import { createContext, useState } from "react";
import PropTypes from "prop-types";

const BoardContext = createContext({});

export const BoardProvider = ({ children }) => {
  const [joinedUser, setJoinedUser] = useState({});

  return (
    <BoardContext.Provider value={{ joinedUser, setJoinedUser }}>
      {children}
    </BoardContext.Provider>
  );
};

BoardProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default BoardContext;
