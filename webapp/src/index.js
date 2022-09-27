import ReactDOM from "react-dom";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import BrainsPage from "./pages/Brains";
import SimulationPage from "./pages/simulation/simulation";
import './index.css';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/brains" element={<Layout />}>
          <Route index element={<BrainsPage />} />
        </Route>
        <Route path="/simulation" element={<Layout />}>
          <Route index element={<SimulationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));