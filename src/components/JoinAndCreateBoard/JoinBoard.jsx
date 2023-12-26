import { useState } from "react";
import PropTypes from "prop-types";
import { GrClose } from "react-icons/gr";
import { BiSolidAddToQueue } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const JoinBoardModal = ({ JoinBoardRef, boardId }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");

  const handleJoinBoard = (boardId) => {
    if (user) {
      navigate(`/${boardId}/${user}`);
    }
  };

  return (
    <dialog ref={JoinBoardRef} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <input
          id="userName"
          name="userName"
          type="text"
          placeholder="Enter your name here"
          className="input input-bordered input-info w-full"
          value={user}
          required
          onChange={(e) => setUser(e.target.value)}
        />
        <div className="modal-action justify-between">
          <button
            className="btn btn-outline btn-primary"
            onClick={() => JoinBoardRef.current.close()}
          >
            <GrClose className="text-3xl" />
          </button>

          <button
            className="btn btn-outline btn-accent"
            onClick={() => handleJoinBoard(boardId)}
          >
            <BiSolidAddToQueue className="text-3xl" />
          </button>
        </div>
      </div>
    </dialog>
  );
};

JoinBoardModal.propTypes = {
  JoinBoardRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }),
  boardId: PropTypes.string.isRequired,
};

export default JoinBoardModal;
