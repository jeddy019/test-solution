import React from "react";
import ReactDOM from "react-dom/client";
import { client } from "@tilework/opus";
import "./index.css";
import App from "./App";

client.setEndpoint("http://localhost:4000/");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
