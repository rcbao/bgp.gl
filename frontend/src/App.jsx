import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import OverviewMapPage from "./components/OverviewMapPage";
import StateMapPage from "./components/StateMapPage";
import Header from "./components/Header";

export default function App() {
    return (
        // The Switch decides which component to show based on the current URL.
        <div
            className="flex flex-col  bg-slate-50 overscroll-contain"
            style={{ height: "100vh" }}
        >
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path={`/`} element={<OverviewMapPage />} />
                    <Route path="/state/:state" element={<StateMapPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}
