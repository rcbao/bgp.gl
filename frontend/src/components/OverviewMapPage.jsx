import React from "react";
import { useNavigate } from "react-router-dom";
import "maplibre-gl/dist/maplibre-gl.css";
import OverviewMap from "./OverviewMap";

const OverviewMapPage = () => {
    const navigate = useNavigate();

    return (
        <div className="columns-2 flex flex-row">
            <OverviewMap navigate={navigate} data={[]} />
            <div style={{ width: "40vw" }} className="p-10">
                <h1 className="text-3xl font-bold">
                    United States BGP Traffic Map
                </h1>
                <div className="my-6">
                    <h2 className="text-xl font-bold my-4">
                        High-level Overview
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="dashboard-widget-card ">
                            <h5 className="dashboard-widget-card-header">
                                BGP Announcements
                            </h5>
                            <h3 className="dashboard-widget-card-data">
                                {128000}
                            </h3>
                        </div>
                        <div className="dashboard-widget-card">
                            <h5 className="dashboard-widget-card-header">
                                Most Advertised Prefix
                            </h5>
                            <h3 className="dashboard-widget-card-data">
                                127.0.0.1
                            </h3>
                        </div>
                        <div className="dashboard-widget-card">
                            <h5 className="dashboard-widget-card-header">
                                Org with Most Routes
                            </h5>
                            <h3 className="dashboard-widget-card-data">
                                Google Inc.
                            </h3>
                        </div>
                        <div className="dashboard-widget-card">
                            <h5 className="dashboard-widget-card-header">
                                Most Advertised Prefix Length
                            </h5>
                            <h3 className="dashboard-widget-card-data">12</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewMapPage;
