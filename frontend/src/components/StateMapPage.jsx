import React from "react";
import { Map } from "react-map-gl";
import maplibregl from "maplibre-gl";
import { useParams } from "react-router-dom";

import { HexagonLayer } from "@deck.gl/aggregation-layers";
import DeckGL from "@deck.gl/react";
import "maplibre-gl/dist/maplibre-gl.css";
import { lightingEffect, material, MAP_STYLE, colorRange } from "./constants";

const INITIAL_VIEW_STATE = {
    longitude: -78.50798,
    latitude: 38.033554,
    zoom: 6,
    minZoom: 4,
    maxZoom: 15,
    pitch: 40.5,
    bearing: -27,
};

function getTooltip({ object }) {
    if (!object) {
        return null;
    }
    const lat = object.position[1];
    const lng = object.position[0];
    const count = object.points.length;

    return `\
    latitude: ${Number.isFinite(lat) ? lat.toFixed(6) : ""}
    longitude: ${Number.isFinite(lng) ? lng.toFixed(6) : ""}
    ${count} Accidents`;
}

function StateSpecificComponent({
    data,
    mapStyle = MAP_STYLE,
    radius = 1000,
    upperPercentile = 100,
    coverage = 1,
}) {
    const layers = [
        new HexagonLayer({
            id: "heatmap",
            colorRange,
            coverage,
            data,
            elevationRange: [0, 3000],
            elevationScale: data && data.length ? 50 : 0,
            extruded: true,
            getPosition: (d) => d,
            pickable: true,
            radius,
            upperPercentile,
            material,

            transitions: {
                elevationScale: 3000,
            },
        }),
    ];

    return (
        <div style={{ height: "100vh", width: "60vw", position: "relative" }}>
            <DeckGL
                layers={layers}
                effects={[lightingEffect]}
                initialViewState={INITIAL_VIEW_STATE}
                controller={true}
                getTooltip={getTooltip}
            >
                <Map
                    reuseMaps
                    mapLib={maplibregl}
                    mapStyle={mapStyle}
                    preventStyleDiffing={true}
                />
            </DeckGL>
        </div>
    );
}

const StateMapPage = () => {
    let { state } = useParams();
    console.log(state);

    return (
        <div className="columns-2 flex flex-row">
            <StateSpecificComponent data={[]} />
            <div style={{ width: "40vw" }} className="p-10">
                <h1 className="text-3xl font-bold" style={{ color: "black" }}>
                    {state} BGP Traffic
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
                                BGP Announcements
                            </h5>
                            <h3 className="dashboard-widget-card-data">{3}</h3>
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
                                state Inc.
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

export default StateMapPage;
