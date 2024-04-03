import { Map } from "react-map-gl";
import maplibregl from "maplibre-gl";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
import DeckGL from "@deck.gl/react";
import { lightingEffect, material, MAP_STYLE, colorRange } from "./constants";

const stateViewState = {
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

const StateMap = ({
    data,
    mapStyle = MAP_STYLE,
    radius = 1000,
    upperPercentile = 100,
    coverage = 1,
}) => {
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
                initialViewState={stateViewState}
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
};

export default StateMap;
