import { useState } from "react";
import PropTypes from "prop-types";
import { GrClose } from "react-icons/gr";
import { BiSolidAddToQueue } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../../api/fetchData";

const CreateBoardModal = ({ createBoardRef }) => {
  const CREATE_BOARD_URI = "/create-board";
  const CREATED_STATUS = 201;
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [boardNm, setBoardNm] = useState("");

  const handleCreateBoard = async () => {
    try {
      const res = await fetchData.post(CREATE_BOARD_URI, {
        userName: user,
        boardName: boardNm,
      });

      if (res.status === CREATED_STATUS) {
        const { _id: boardId } = res.data.board;

        navigate(`/${boardId}`);
        createBoardRef.current.close();
      }
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };

  return (
    <dialog ref={createBoardRef} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <form className=" space-y-4">
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
          <input
            id="boardName"
            name="boardName"
            type="text"
            placeholder="Enter a new board name"
            className="input input-bordered input-info w-full"
            value={boardNm}
            required
            onChange={(e) => setBoardNm(e.target.value)}
          />
        </form>
        <div className="modal-action justify-between">
          <button
            className="btn btn-outline btn-primary"
            onClick={() => createBoardRef.current.close()}
          >
            <GrClose className="text-3xl" />
          </button>
          <button
            className="btn btn-outline btn-accent"
            onClick={handleCreateBoard}
          >
            <BiSolidAddToQueue className="text-3xl" />
          </button>
        </div>
      </div>
    </dialog>
  );
};

CreateBoardModal.propTypes = {
  createBoardRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }),
};

export default CreateBoardModal;
