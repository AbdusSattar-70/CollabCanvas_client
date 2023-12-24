import PropTypes from "prop-types";
import { BsTools } from "react-icons/bs";
import { FaCircleUser } from "react-icons/fa6";
import { FaBorderAll } from "react-icons/fa6";
import { v4 as uuid } from "uuid";
import { TOOL_ITEMS } from "../../utils/constants";

const NotifyAndShape = ({ activeUsers, roomList, handleToolChange }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mr-4 pl-4">
      {/* Active users */}
      <div className="cursor-pointer flex justify-center items-center h-10 w-10 rounded-md ">
        <div className="dropdown dropdown-hover ">
          <div tabIndex={0} role="button" className="btn">
            <FaCircleUser className="text-xl" />
          </div>
          {activeUsers.length ? (
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-25"
            >
              {activeUsers?.map((user) => (
                <li key={uuid()}>
                  <div>
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500 me-2" />
                    {user?.name?.split(" ")[0]}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-25"
            >
              <li>No active user</li>
            </ul>
          )}
        </div>
      </div>

      {/* Active rooms */}
      <div className="cursor-pointer flex justify-center items-center h-10 w-10 rounded-md">
        <div className="dropdown dropdown-hover">
          <div tabIndex={0} role="button" className="btn">
            <FaBorderAll className="text-xl" />
          </div>
          {activeUsers.length ? (
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-25"
            >
              {roomList?.map((room) => (
                <li key={uuid()}>
                  <button>
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500 me-2" />
                    {room?.split(" ")[0]}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-25"
            >
              <li>No active room</li>
            </ul>
          )}
        </div>
      </div>

      {/* Shapes */}
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
    </div>
  );
};

NotifyAndShape.propTypes = {
  activeUsers: PropTypes.array.isRequired,
  roomList: PropTypes.array.isRequired,
  handleToolChange: PropTypes.func.isRequired,
};

export default NotifyAndShape;
