/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import { useRef } from "react";
import JoinBoardModal from "./JoinBoard";
import stageImg from "../../assets/stage.png";

const DisplayBoards = ({ boardName, boardId, userName, url }) => {
  const JoinBoardRef = useRef();
  const isBase64Image = /^data:image\/png;base64,/.test(url);

  return (
    <div>
      <div className="card card-compact bg-base-100 shadow-xl">
        <figure style={{ width: "100%", height: "150px", overflow: "hidden" }}>
          <img
            src={isBase64Image ? url : stageImg}
            alt="stage thumbnail"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
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

DisplayBoards.propTypes = {
  boardId: PropTypes.string.isRequired,
  boardName: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
};

export default DisplayBoards;
