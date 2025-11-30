import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.jsx"
import TwitchSubscription from "./TwitchSubscription.jsx"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TwitchSubscription />
    <App />
  </StrictMode>
)
