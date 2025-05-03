import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import BoardView from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BoardView />
  </StrictMode>
);
