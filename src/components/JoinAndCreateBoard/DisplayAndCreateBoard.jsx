import { useEffect, useRef, useState } from "react";
import { BiSolidAddToQueue } from "react-icons/bi";
import CreateBoardModal from "./CreateBoardModal";
import { fetchData } from "../../api/fetchData";
import DisplayBoards from "./DisplayBoards";

const DisplayAndCreateBoard = () => {
  const GET_BOARD_URI = "/boards";
  const GET_BOARD_OK = 200;
  const createBoardRef = useRef();
  const [boardList, setBoardList] = useState([]);
  useEffect(() => {
    const getBoards = async () => {
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
    getBoards();
  }, []);

  return (
    <section className="grid gap-4 md:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-4 md:mx-8 lg:mx-16 xl:mx-24 2xl:mx-32 my-8 md:my-10">
      {boardList.length ? (
        boardList.map(({ _id: boardId, boardName, userName, url }) => (
          <DisplayBoards
            key={String(boardId)}
            boardId={boardId}
            boardName={boardName}
            userName={userName}
            url={url}
          />
        ))
      ) : (
        <div className="text-center">No Board to Display</div>
      )}
      <CreateBoardModal createBoardRef={createBoardRef} />
      <div
        data-tip="Create New Board"
        className="card card-compact bg-base-100 flex justify-center items-center lg:tooltip col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 2xl:col-span-6"
      >
        <BiSolidAddToQueue
          role="button"
          aria-label="create board button"
          className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl cursor-pointer text-blue-400 hover:text-slate-300"
          onClick={() => createBoardRef.current.showModal()}
        />
      </div>
    </section>
  );
};

export default DisplayAndCreateBoard;
