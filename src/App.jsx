import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import FollowingLight from "./components/FollowingLight";
import Header from "./components/Header";
import MobileMoverLanding from "./pages/MobileMoverLanding";
import Purchase from "./pages/Purchase";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Header />
      <FollowingLight strength={1} />
      <Routes>
        <Route path="/" element={<MobileMoverLanding />} />
        <Route path="/purchase" element={<Purchase />} />
      </Routes>
    </BrowserRouter>
  );
}
