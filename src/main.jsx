import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import "./index.css";
import App from "../App";
import ErrorPage from "./errorPage/ErrorPage";
import Whiteboard from "./components/Whiteboard";
import DisplayAndCreateBoard from "./components/JoinAndCreateBoard/DisplayAndCreateBoard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <DisplayAndCreateBoard />,
      },
      {
        path: "/:id/:name",
        element: <Whiteboard />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <main className="overflow-x-hidden">
    <RouterProvider router={router} />
  </main>
);
