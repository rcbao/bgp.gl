import React from "react";
import { Map } from "react-map-gl";
import maplibregl from "maplibre-gl";
import { useNavigate } from "react-router-dom";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import "maplibre-gl/dist/maplibre-gl.css";
import usStatesGeoJson from "./us-states.json";
import { lightingEffect, material, MAP_STYLE, colorRange } from "./constants";

const INITIAL_VIEW_STATE = {
    longitude: -97,
    latitude: 40,
    zoom: 3.3,
    maxZoom: 10,
};

function getTooltip({ object }) {
    if (!object) {
        return null;
    }
    const stateName = object.properties.name;

    return `${stateName}`;
}

function OverviewMapComponent({
    data,
    navigate,
    mapStyle = MAP_STYLE,
    radius = 1000,
    upperPercentile = 100,
    coverage = 1,
}) {
    const geoJsonLayer = new GeoJsonLayer({
        id: "geojson-layer",
        data: usStatesGeoJson,
        stroked: true,
        filled: true,
        lineWidthMinPixels: 2,
        getFillColor: [160, 160, 180, 50],
        getLineColor: [0, 0, 0, 255],
        pickable: true, // Enable picking
        onClick: ({ object, x, y }) => {
            // Check if an object was clicked
            if (object) {
                const stateName = object.properties.name; // Assuming 'name' contains the state name
                console.log(`hi from ${stateName}`);
                navigate(`/state/${stateName}`);
            }
        },
    });

    const hexagonLayer = new HexagonLayer({
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
    });

    const layers = [geoJsonLayer, hexagonLayer];
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

const OverviewMapPage = () => {
    const navigate = useNavigate();

    return (
        <div className="columns-2 flex flex-row">
            <OverviewMapComponent navigate={navigate} data={[]} />
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
