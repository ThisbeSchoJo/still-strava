import React from "react";
import "./styling/index.css";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserProvider } from "./context/UserContext"; // 🆕
import routes from "./routes";

const router = createBrowserRouter(routes);

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <UserProvider>
    <RouterProvider router={router} />
  </UserProvider>
);
