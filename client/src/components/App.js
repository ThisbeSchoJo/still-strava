import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./shared/NavBar";

function App() {
  return (
    <div>
      <h1>Still Strava</h1>
      <NavBar />
      <Outlet />
    </div>
  );
}

export default App;
