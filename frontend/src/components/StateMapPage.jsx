import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "maplibre-gl/dist/maplibre-gl.css";
import StateMap from "./StateMap";
import { findStateByAbbreviation } from "./utils/utils";
import PrefixDistributionChart from "./PrefixDistroChart";

const StateMapPage = () => {
    const { state: stateAbbr } = useParams();
    const stateName = findStateByAbbreviation(stateAbbr).properties.name;

    const navigate = useNavigate();
    const [data, setData] = useState({});
    const [mapData, setMapData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(
                `http://127.0.0.1:8000/state-data/${stateName}/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const res = await response.json();
            if (response.ok) {
                setData(res);
                setMapData(res["charts"]["stateAnnouncementHeatMap"]);
            } else {
                navigate(`/`);
            }
        };

        fetchData();
    }, [navigate]);

    if (!data || !data["charts"]) {
        return null;
    }

    // Get most advertised prefix length
    const prefixDist = data["charts"]["prefixLengthDistribution"];
    const maxLengthIndex = prefixDist["counts"].indexOf(
        Math.max(...prefixDist["counts"])
    );
    const maxLength = prefixDist["lengths"][maxLengthIndex];

    return (
        data && (
            <div className="columns-2 flex flex-row">
                <StateMap data={mapData} stateName={stateAbbr} />
                <div style={{ width: "40vw" }} className="p-10">
                    <h1
                        className="text-3xl font-bold"
                        style={{ color: "black" }}
                    >
                        {stateName} BGP Traffic
                    </h1>
                    <div className="my-6">
                        <h2
                            className="text-xl font-bold my-4"
                            style={{ color: "black" }}
                        >
                            State-level Overview
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="dashboard-widget-card ">
                                <h5 className="dashboard-widget-card-header">
                                    # BGP Announcements
                                </h5>
                                <h3 className="dashboard-widget-card-data">
                                    {data["overview"]["numberOfAnnouncements"]}
                                </h3>
                            </div>
                            <div className="dashboard-widget-card">
                                <h5 className="dashboard-widget-card-header">
                                    # Local ASes
                                </h5>
                                <h3 className="dashboard-widget-card-data">
                                    {data["overview"]["numberOfLocalASes"]}
                                </h3>
                            </div>
                            <div className="dashboard-widget-card">
                                <h5 className="dashboard-widget-card-header">
                                    Most Advertised Prefix
                                </h5>
                                <h3 className="dashboard-widget-card-data">
                                    {
                                        data["overview"][
                                            "mostAdvertisedIpPrefixes"
                                        ]
                                    }
                                </h3>
                            </div>

                            <div className="dashboard-widget-card">
                                <h5 className="dashboard-widget-card-header">
                                    Most Advertised Prefix Length
                                </h5>
                                <h3 className="dashboard-widget-card-data">
                                    {maxLength}
                                </h3>
                            </div>
                            <PrefixDistributionChart
                                regionName={stateName}
                                data={
                                    data["charts"]["prefixLengthDistribution"]
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default StateMapPage;
