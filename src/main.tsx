import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { MangaProvider } from "./context/MangaContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MangaProvider>
      <App />
    </MangaProvider>
  </StrictMode>,
);
