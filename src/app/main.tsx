import { createRoot } from "react-dom/client";
import { App } from "./App";
import { AppProviders } from "./providers/AppProviders";
import "./styles/globals.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Application root element was not found.");
}

createRoot(rootElement).render(
  <AppProviders>
    <App />
  </AppProviders>,
);
