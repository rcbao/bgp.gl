import { Map } from "react-map-gl";
import maplibregl from "maplibre-gl";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import usStatesGeoJson from "./us-states.json";
import { lightingEffect, material, MAP_STYLE, colorRange } from "./constants";

const overviewViewState = {
    longitude: -97,
    latitude: 40,
    zoom: 3.3,
    maxZoom: 10,
};

const getTooltip = ({ object }) => {
    if (!object) {
        return null;
    }
    const stateName = object.properties.name;
    const stateAbbr = object.properties.abbreviation;

    return `${stateName} (${stateAbbr.toUpperCase()})`;
};

const OverviewMap = ({
    data,
    navigate,
    mapStyle = MAP_STYLE,
    radius = 1000,
    upperPercentile = 100,
    coverage = 1,
}) => {
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
            if (object) {
                const stateAbbr = object.properties.abbreviation;
                navigate(`/${stateAbbr}`);
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
                initialViewState={overviewViewState}
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
export default OverviewMap;
