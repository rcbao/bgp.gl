import { Map } from "react-map-gl";
import maplibregl from "maplibre-gl";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import usStatesGeoJson from "./us-states.json";
import {
    lightingEffect,
    mapComponentStyle,
    overviewViewState,
    MAP_STYLE,
} from "./constants";

const getTooltip = ({ object }) => {
    if (!object) {
        return null;
    }
    const stateName = object.properties.name;
    const stateAbbr = object.properties.abbreviation;

    return `${stateName} (${stateAbbr.toUpperCase()})`;
};

const OverviewMap = ({ data, navigate, mapStyle = MAP_STYLE }) => {
    const geoJsonLayer = new GeoJsonLayer({
        id: "geojson-layer",
        data: usStatesGeoJson,
        stroked: true,
        filled: true,
        lineWidthMinPixels: 2,
        getFillColor: [160, 160, 180, 50],
        getLineColor: [0, 0, 0, 255],
        pickable: true,
        onClick: ({ object, x, y }) => {
            if (object) {
                const stateAbbr = object.properties.abbreviation;
                navigate(`/${stateAbbr}`);
            }
        },
    });

    const layers = [geoJsonLayer];
    return (
        <div style={mapComponentStyle}>
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
