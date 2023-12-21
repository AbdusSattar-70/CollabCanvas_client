import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import "./index.css";
import Whiteboard from "./components/Whiteboard";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <Whiteboard />
  </Router>
);
