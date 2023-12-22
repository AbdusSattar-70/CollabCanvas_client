import { createContext, useState } from "react";
import PropTypes from "prop-types";

const BoardContext = createContext({});

export const BoardProvider = ({ children }) => {
  const [board, setBoard] = useState([]);

  return (
    <BoardContext.Provider value={{ board, setBoard }}>
      {children}
    </BoardContext.Provider>
  );
};

BoardProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default BoardContext;
