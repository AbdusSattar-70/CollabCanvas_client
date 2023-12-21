import {
  faEraser,
  faPencil,
  faRotateLeft,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BsTools } from "react-icons/bs";
import { FaEyeDropper } from "react-icons/fa6";
import PropTypes from "prop-types";

import { TOOL_ITEMS } from "../../utils/constants";

const Menu = ({
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
    <div className="absolute px-5 py-1 flex justify-between w-[55rem] left-1/2 top-3 rounded-md transform -translate-x-1/2 bg-slate-200 border-2 border-red-200 shadow-2xl z-10">
      <div className="cursor-pointer flex justify-center items-center h-10 w-10 rounded-md ">
        <div className="dropdown dropdown-hover text-sm">
          <div tabIndex={0} role="button" className="btn">
            <BsTools />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-25"
          >
            <li>
              <button onClick={() => handleToolChange(TOOL_ITEMS.RECT)}>
                Rectangle
              </button>
            </li>
            <li>
              <button onClick={() => handleToolChange(TOOL_ITEMS.STAR)}>
                Star
              </button>
            </li>
            <li>
              <button onClick={() => handleToolChange(TOOL_ITEMS.CIRCLE)}>
                Circle
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="cursor-pointer flex justify-center items-center h-10 w-15 rounded-md ">
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
        <div className="text-sm flex flex-col justify-center items-center">
          <label htmlFor="brushStroke" className="text-sm">
            Brush Stroke
          </label>
          <input
            id="brushStroke"
            name="brushStroke"
            type="range"
            value={brushSize}
            min={1}
            max={10}
            onChange={(e) => handleBrushSize(e.target.value)}
            className=" hover:bg-slate-400 active:bg-slate-400"
          />
        </div>
      </div>
      <button
        onClick={() => handleToolChange(TOOL_ITEMS.PENCIL)}
        className="cursor-pointer flex justify-center items-center h-10 w-15 rounded-md "
      >
        <kbd className="kbd text-xl  hover:bg-slate-400 active:bg-slate-400">
          <FontAwesomeIcon icon={faPencil} />
        </kbd>
      </button>

      <button
        onClick={() => handleToolChange(TOOL_ITEMS.ERASER)}
        className="cursor-pointer flex justify-center items-center h-10 w-15 rounded-md"
      >
        <kbd className="kbd text-xl  hover:bg-slate-400 active:bg-slate-400">
          <FontAwesomeIcon icon={faEraser} />
        </kbd>
      </button>
      <button
        onClick={handleClear}
        className="cursor-pointer flex justify-center items-center h-10 w-15 rounded-md"
      >
        <kbd className="kbd  hover:bg-slate-400 active:bg-slate-400">Clear</kbd>
      </button>
      <button
        onClick={handleUndo}
        className="cursor-pointer flex justify-center items-center h-10 w-15 rounded-md"
      >
        <kbd className="kbd text-xl hover:bg-slate-400 active:bg-slate-400">
          <FontAwesomeIcon icon={faRotateLeft} />
        </kbd>
      </button>
      <button
        onClick={handleRedo}
        className="cursor-pointer flex justify-center items-center h-10 w-15 rounded-md"
      >
        <kbd className="kbd text-xl  hover:bg-slate-400 active:bg-slate-400">
          <FontAwesomeIcon icon={faRotateRight} />
        </kbd>
      </button>
    </div>
  );
};

Menu.propTypes = {
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
