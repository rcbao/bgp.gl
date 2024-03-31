import React from "react";
import { Map } from "react-map-gl";
import maplibregl from "maplibre-gl";
import { AmbientLight, PointLight, LightingEffect } from "@deck.gl/core";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
import DeckGL from "@deck.gl/react";
import "maplibre-gl/dist/maplibre-gl.css";
import { Link, useNavigate } from "react-router-dom";

const ambientLight = new AmbientLight({
    color: [255, 255, 255],
    intensity: 1.0,
});

const pointLight1 = new PointLight({
    color: [255, 255, 255],
    intensity: 0.8,
    position: [-0.144528, 49.739968, 80000],
});

const pointLight2 = new PointLight({
    color: [255, 255, 255],
    intensity: 0.8,
    position: [-3.807751, 54.104682, 8000],
});

const lightingEffect = new LightingEffect({
    ambientLight,
    pointLight1,
    pointLight2,
});

const material = {
    ambient: 0.64,
    diffuse: 0.6,
    shininess: 32,
    specularColor: [51, 51, 51],
};

const INITIAL_VIEW_STATE = {
    longitude: -78.507980,
    latitude: 38.033554,
    zoom: 6,
    minZoom: 4,
    maxZoom: 15,
    pitch: 40.5,
    bearing: -27,
};

const MAP_STYLE =
    "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json";

const stateBoundaries = {
    "Alabama": [-88.473227, 30.223334, -84.88908, 35.008028],
    "Alaska": [-179.148909, 51.214183, 179.77847, 71.365162],
    "Arizona": [-114.818267, 31.332177, -109.045223, 37.00426],
    "Arkansas": [-94.617919, 33.004106, -89.644395, 36.4996],
    "California": [-124.409591, 32.534156, -114.131211, 42.009518],
    "Colorado": [-109.060257, 36.992426, -102.041524, 41.003444],
    "Connecticut": [-73.727775, 40.980144, -71.787437, 42.050587],
    "Delaware": [-75.788658, 38.451013, -75.048939, 39.839007],
    "Florida": [-87.634938, 24.396308, -80.031362, 31.000888],
    "Georgia": [-85.605165, 30.355644, -80.839729, 35.000771],
    "Hawaii": [-178.334698, 18.910361, -154.806773, 28.402123],
    "Idaho": [-117.243027, 41.988057, -111.043564, 49.001146],
    "Illinois": [-91.513079, 36.970298, -87.494756, 42.508481],
    "Indiana": [-88.09776, 37.771742, -84.784579, 41.760592],
    "Iowa": [-96.639704, 40.375501, -90.140061, 43.501196],
    "Kansas": [-102.051744, 36.993083, -94.588413, 40.003162],
    "Kentucky": [-89.571509, 36.497129, -81.964971, 39.147458],
    "Louisiana": [-94.043147, 28.928609, -88.758389, 33.019457],
    "Maine": [-71.083924, 42.977764, -66.949895, 47.459686],
    "Maryland": [-79.487651, 37.912376, -75.048939, 39.723043],
    "Massachusetts": [-73.508142, 41.186322, -69.928393, 42.886589],
    "Michigan": [-90.418136, 41.696118, -82.413474, 47.76759],
    "Minnesota": [-97.239209, 43.499356, -89.491739, 49.384358],
    "Mississippi": [-91.655009, 30.173943, -88.097888, 34.996052],
    "Missouri": [-95.774704, 35.995686, -89.098843, 40.61364],
    "Montana": [-116.049151, 44.358221, -104.039648, 49.00139],
    "Nebraska": [-104.053514, 39.999998, -95.30829, 43.001708],
    "Nevada": [-120.005746, 35.001857, -114.039648, 42.002207],
    "New Hampshire": [-72.557247, 42.69699, -70.610621, 45.305476],
    "New Jersey": [-75.559614, 38.928519, -73.893979, 41.357423],
    "New Mexico": [-109.050173, 31.332301, -103.001964, 37.000232],
    "New York": [-79.76259, 40.477399, -71.185658, 45.01585],
    "North Carolina": [-84.321869, 33.842316, -75.400119, 36.588117],
    "North Dakota": [-104.0489, 45.935073, -96.554507, 49.000574],
    "Ohio": [-84.820159, 38.403202, -80.518693, 41.977523],
    "Oklahoma": [-103.002565, 33.615833, -94.430662, 37.002206],
    "Oregon": [-124.566244, 41.991056, -116.46326, 46.292035],
    "Pennsylvania": [-80.519851, 39.7198, -74.689516, 42.26986],
    "Rhode Island": [-71.862772, 41.146339, -71.12057, 42.018798],
    "South Carolina": [-83.35391, 32.0346, -78.54203, 35.215402],
    "South Dakota": [-104.057698, 42.479635, -96.436589, 45.94545],
    "Tennessee": [-90.310298, 34.982972, -81.6469, 36.678118],
    "Texas": [-106.645646, 25.837164, -93.508292, 36.500704],
    "Utah": [-114.052962, 36.997968, -109.041058, 42.001567],
    "Vermont": [-73.43774, 42.726853, -71.464056, 45.016659],
    "Virginia": [-83.67529, 36.540738, -75.242266, 39.466012],
    "Washington": [-124.848974, 45.543541, -116.916522, 49.002494],
    "West Virginia": [-82.644739, 37.201483, -77.719519, 40.638801],
    "Wisconsin": [-92.888114, 42.491983, -86.805415, 47.080621],
    "Wyoming": [-111.056888, 40.994746, -104.05216, 45.005904]
};    

export const colorRange = [
    [1, 152, 189],
    [73, 227, 206],
    [216, 254, 181],
    [254, 237, 177],
    [254, 173, 84],
    [209, 55, 78],
];

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

function OverviewMapComponent({
    data,
    mapStyle = MAP_STYLE,
    radius = 1000,
    upperPercentile = 100,
    coverage = 1,
}) {
        const navigate = useNavigate();
        const handleClick = (event) => {
            const { lng, lat } = event.lngLat; // longitude and latitude of click
            if (lng >= -171 && lng <= -66 && lat >= 18 && lat <= 71) { // checking if user clicked inside the US
                for (const state in stateBoundaries) {
                    const [minLng, minLat, maxLng, maxLat] = stateBoundaries[state]; // checking which state the user clicked
                    if (lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat) {
                        console.log(`Clicked on ${state}`);
                        // navigate(`/state/${state}`);
                        break;
                    }
                }
            } else {
                console.log("Clicked outside the US");
    }

        };
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
                <Link to="state">
                    <Map
                        onClick={handleClick}
                        reuseMaps
                        mapLib={maplibregl}
                        mapStyle={mapStyle}
                        preventStyleDiffing={true}
                    />
                </Link>
            </DeckGL>
        </div>
    );
}

const OverviewMapPage = () => {
    return (
        <div className="columns-2 flex flex-row">
            <OverviewMapComponent data={[]} />
            <div style={{ width: "40vw" }} className="p-10">
                <h1 className="text-3xl font-bold" style={{ color: "black" }}>
                    United States BGP Traffic Map
                </h1>
                <div className="my-6">
                    <h2 className="text-xl font-bold my-4" style={{ color: "black" }}>
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
