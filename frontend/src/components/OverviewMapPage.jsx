import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "maplibre-gl/dist/maplibre-gl.css";
import OverviewMap from "./OverviewMap";
import PrefixDistributionChart from "./PrefixDistroChart";

const OverviewMapPage = () => {
    const navigate = useNavigate();

    const [data, setData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`http://127.0.0.1:8000/us-overview/`, {
                // posts the form to users/me/items. You need to login to be able to send this
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const mapData = await response.json();
            if (response.ok) {
                setData(mapData);
                console.log(mapData);
            } else {
                // if cannot access user info: show an error message
                navigate(`/`);
            }
        };

        fetchData();
    }, [navigate]);

    if (!(data && data["overview"] && data["prefixLengthDistribution"])) {
        return null;
    }

    return (
        data && (
            <div className="columns-2 flex flex-row">
                <OverviewMap navigate={navigate} data={data} />
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
                                    # BGP Announcements
                                </h5>
                                <h3 className="dashboard-widget-card-data">
                                    {data["overview"]["numberOfAnnouncements"]}
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
                                    Org with Most Routes
                                </h5>
                                <h3 className="dashboard-widget-card-data">
                                    {
                                        data["overview"][
                                            "asWithMostAnnouncementsName"
                                        ]
                                    }
                                </h3>
                            </div>
                            <div className="dashboard-widget-card">
                                <h5 className="dashboard-widget-card-header">
                                    Most Advertised Prefix Length
                                </h5>
                                <h3 className="dashboard-widget-card-data">
                                    {data["overview"]["mostCommonPrefixLength"]}
                                </h3>
                            </div>
                            <PrefixDistributionChart
                                data={data["prefixLengthDistribution"]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default OverviewMapPage;
