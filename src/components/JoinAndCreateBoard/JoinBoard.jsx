import { useState } from "react";
import PropTypes from "prop-types";
import { GrClose } from "react-icons/gr";
import { BiSolidAddToQueue } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import useBoard from "../../hooks/useBoard";
import { fetchData } from "../../api/fetchData";

const JoinBoardModal = ({ JoinBoardRef, boardId }) => {
  const UPDATE_BOARD_URI = "/update-board";
  const { setBoard } = useBoard();
  const navigate = useNavigate();
  const [joinedUser, setJoinedUser] = useState("");

  const handleJoinBoard = async (currentBoardId) => {
    if (joinedUser) {
      try {
        const res = await fetchData.patch(UPDATE_BOARD_URI, {
          _id: currentBoardId,
          joinedUser,
        });

        setBoard(res.data);
        navigate(`/${currentBoardId}`);
      } catch (error) {
        console.error("Error joining board:", error);
      }
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
