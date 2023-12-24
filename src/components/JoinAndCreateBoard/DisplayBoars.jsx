import PropTypes from "prop-types";
import { useRef } from "react";
import JoinBoardModal from "./JoinBoard";

const DisplayBoars = ({ boardName, boardId, userName }) => {
  const JoinBoardRef = useRef();
  return (
    <div>
      <div className="card card-compact bg-base-100 shadow-xl">
        <figure>
          <img
            src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
            alt="Shoes"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{boardName.split(" ")[0]}</h2>
          <p>Created by: {userName.split(" ")[0]}</p>
          <button
            aria-label="create board button"
            className="btn btn-outline btn-secondary"
            onClick={() => JoinBoardRef.current.showModal()}
          >
            Join Board
          </button>
        </div>
      </div>
      <JoinBoardModal JoinBoardRef={JoinBoardRef} boardId={boardId} />
    </div>
  );
};

DisplayBoars.propTypes = {
  boardId: PropTypes.string.isRequired,
  boardName: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
};

export default DisplayBoars;
