import { GeoJsonLayer } from "@deck.gl/layers";
import usStatesGeoJson from "./us-states.json";
import DeckGLMap from "./DeckGLMap";
import { fillColors } from "./utils/constants";

const getTooltip = ({ object }) => {
    if (!object) {
        return null;
    }
    const stateName = object.properties.name;
    const stateAbbr = object.properties.abbreviation;

    return `${stateName} (${stateAbbr.toUpperCase()})`;
};

export const overviewViewState = {
    longitude: -97,
    latitude: 40,
    zoom: 3.3,
    maxZoom: 10,
};

const OverviewMap = ({ data, navigate }) => {
    const geoJsonLayer = new GeoJsonLayer({
        id: "geojson-layer",
        data: usStatesGeoJson,
        stroked: true,
        filled: true,
        lineWidthMinPixels: 2,
        getFillColor: fillColors.default,
        getLineColor: [0, 0, 0, 255],
        autoHighlight: true,
        highlightColor: fillColors.highlight,
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
        <DeckGLMap
            layers={layers}
            viewState={overviewViewState}
            getTooltip={getTooltip}
        />
    );
};
export default OverviewMap;
