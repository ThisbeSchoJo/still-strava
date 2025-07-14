import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./shared/NavBar";
import "../styling/app.css";

function App() {
  return (
    <>
      <header>
        <h1>Still StrΛvΛ</h1>
      </header>
      <NavBar />
      <main id="main-content" role="main">
        <Outlet />
      </main>
    </>
  );
}

export default App;
