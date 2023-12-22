import { useState } from "react";
import PropTypes from "prop-types";
import { GrClose } from "react-icons/gr";
import { BiSolidAddToQueue } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import useJoinedUsers from "../../hooks/useJoinedUsers";

const JoinBoardModal = ({ JoinBoardRef, boardId, boardName }) => {
  const { setJoinedUsers } = useJoinedUsers();
  const navigate = useNavigate();
  const [joinedUser, setJoinedUser] = useState("");

  const handleJoinBoard = (boardId, boardName) => {
    if (joinedUser) {
      setJoinedUsers((prev) => ({
        ...prev,
        boards: {
          ...prev.boardIds,
          [boardName]: [...(prev.boards[boardName] || []), joinedUser],
        },
      }));
      navigate(`/${boardId}`);
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
          value={joinedUser}
          required
          onChange={(e) => setJoinedUser(e.target.value)}
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
            onClick={() => handleJoinBoard(boardId, boardName)}
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
  boardName: PropTypes.string.isRequired,
};

export default JoinBoardModal;
