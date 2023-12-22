import { useEffect, useRef, useState } from "react";
import { BiSolidAddToQueue } from "react-icons/bi";
import CreateBoardModal from "./CreateBoardModal";
import { fetchData } from "../../api/fetchData";
import DisplayBoars from "./DisplayBoars";

const DisplayAndCreateBoard = () => {
  const GET_BOARD_URI = "/boards";
  const GET_BOARD_OK = 200;
  const createBoardRef = useRef();
  const [boardList, setBoardList] = useState([]);

  useEffect(() => {
    const getBoard = async () => {
      try {
        const res = await fetchData.get(GET_BOARD_URI);
        if (res.status === GET_BOARD_OK) {
          const result = res.data;
          setBoardList([...result]);
        }
      } catch (error) {
        console.error("Error getting board:", error);
      }
    };
    getBoard();
  }, []);

  return (
    <section className="grid gap-8 grid-cols-1 md:grid-cols-4 lg:grid-cols-6 sm:grid-cols-6 mx-10 my-10">
      {boardList.length ? (
        boardList.map(({ _id: boardId, boardName, userName }) => (
          <DisplayBoars
            key={String(boardId)}
            boardId={boardId}
            boardName={boardName}
            userName={userName}
          />
        ))
      ) : (
        <div>No Board to Display</div>
      )}
      <CreateBoardModal createBoardRef={createBoardRef} />
      <div
        data-tip="Create New Board"
        className="card card-compact bg-base-100 flex justify-center items-center lg:tooltip"
      >
        <BiSolidAddToQueue
          role="button"
          aria-label="create board button"
          className=" text-9xl cursor-pointer text-blue-400 hover:text-slate-300"
          onClick={() => createBoardRef.current.showModal()}
        />
      </div>
    </section>
  );
};

export default DisplayAndCreateBoard;
