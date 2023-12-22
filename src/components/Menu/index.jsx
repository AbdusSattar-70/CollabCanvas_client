import PropTypes from "prop-types";
import {
  faEraser,
  faRotateLeft,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { GrClearOption } from "react-icons/gr";
import { ImPencil2 } from "react-icons/im";
import { IoMdResize } from "react-icons/io";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaEyeDropper } from "react-icons/fa6";
import { TOOL_ITEMS } from "../../utils/constants";
import NotifyAndShape from "./NotifyAndShape";

const Menu = ({
  activeUsers,
  roomList,
  currentColor,
  brushSize,
  handleToolChange,
  handleBrushSize,
  handleRedo,
  handleUndo,
  handleClear,
  handleColorChange,
}) => {
  return (
    <div className="grid grid-cols-10 max-w-screen-sm py-4 pl-4 rounded-md bg-slate-300 border-2 border-red-200 shadow-2xl">
      <div className="col-span-3">
        <NotifyAndShape
          handleToolChange={handleToolChange}
          activeUsers={activeUsers}
          roomList={roomList}
        />
      </div>
      <div className="col-span-7">
        <div className="grid grid-cols-7">
          <div className="cursor-pointer flex justify-center items-center h-10 w-10 rounded-md ">
            <div className="text-xl flex flex-col justify-center items-center">
              <FaEyeDropper />
              <input
                type="color"
                id="color"
                name="color"
                value={currentColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="cursor-grabbing"
              />
            </div>
          </div>

          <div className="cursor-pointer flex justify-center items-center h-10 w-10 rounded-md ">
            <div className="dropdown dropdown-hover text-xl">
              <div tabIndex={0} role="button" className="btn">
                <IoMdResize />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-25"
              >
                <li>
                  <li>Brush Stroke</li>
                  <button>
                    <input
                      id="brushStroke"
                      name="brushStroke"
                      type="range"
                      value={brushSize}
                      min={1}
                      max={30}
                      onChange={(e) => handleBrushSize(e.target.value)}
                      className=" hover:bg-slate-400 active:bg-slate-400"
                    />
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => handleToolChange(TOOL_ITEMS.PENCIL)}
            className="text-xl bg-slate-100 w-10  hover:bg-slate-400 active:bg-slate-400 cursor-pointer flex justify-center items-center h-10 rounded-md "
          >
            <ImPencil2 className="text-2xl" />
          </button>

          <button
            onClick={() => handleToolChange(TOOL_ITEMS.ERASER)}
            className="text-xl bg-slate-100 w-10  hover:bg-slate-400 active:bg-slate-400 cursor-pointer flex justify-center items-center h-10 rounded-md "
          >
            <FontAwesomeIcon icon={faEraser} className="text-xl" />
          </button>
          <button
            onClick={handleClear}
            className="text-xl bg-slate-100 w-10  hover:bg-slate-400 active:bg-slate-400 cursor-pointer flex justify-center items-center h-10 rounded-md "
          >
            <GrClearOption className="text-xl" />
          </button>
          <button
            onClick={handleUndo}
            className="text-xl bg-slate-100 w-10  hover:bg-slate-400 active:bg-slate-400 cursor-pointer flex justify-center items-center h-10 rounded-md "
          >
            <FontAwesomeIcon icon={faRotateLeft} className="text-xl" />
          </button>
          <button
            onClick={handleRedo}
            className="text-xl bg-slate-100 w-10  hover:bg-slate-400 active:bg-slate-400 cursor-pointer flex justify-center items-center h-10 rounded-md "
          >
            <FontAwesomeIcon icon={faRotateRight} className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

Menu.propTypes = {
  activeUsers: PropTypes.array.isRequired,
  roomList: PropTypes.array.isRequired,
  currentColor: PropTypes.string.isRequired,
  brushSize: PropTypes.number.isRequired,
  handleToolChange: PropTypes.func.isRequired,
  handleBrushSize: PropTypes.func.isRequired,
  handleRedo: PropTypes.func.isRequired,
  handleUndo: PropTypes.func.isRequired,
  handleClear: PropTypes.func.isRequired,
  handleColorChange: PropTypes.func.isRequired,
};

export default Menu;
