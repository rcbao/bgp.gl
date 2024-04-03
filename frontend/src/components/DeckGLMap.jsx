import { Map } from "react-map-gl";
import maplibregl from "maplibre-gl";
import DeckGL from "@deck.gl/react";
import {
    lightingEffect,
    mapComponentStyle,
    MAP_STYLE as mapStyle,
} from "./constants";

const DeckGLMap = ({ layers, viewState, getTooltip }) => {
    return (
        <div style={mapComponentStyle}>
            <DeckGL
                layers={layers}
                effects={[lightingEffect]}
                initialViewState={viewState}
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

export default DeckGLMap;
