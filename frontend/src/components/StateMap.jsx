import { HexagonLayer } from "@deck.gl/aggregation-layers";
import { material, colorRange } from "./constants";
import usStatesGeoJson from "./us-states.json";
import DeckGLMap from "./DeckGLMap";

const getStateViewState = (stateAbbr) => {
    console.log("state abbreviation: ", stateAbbr);
    const features = usStatesGeoJson.features;
    const stateObj = features.find(
        (f) => f.properties.abbreviation === stateAbbr
    );
    const center = stateObj.properties.center;

    const viewState = {
        longitude: center.longitude,
        latitude: center.latitude,
        zoom: 5.5,
        minZoom: 4,
        maxZoom: 15,
        pitch: 40.5,
        bearing: -27,
    };
    return viewState;
};

const getTooltip = ({ object }) => {
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
};

const StateMap = ({
    data,
    stateName,
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

    const stateViewState = getStateViewState(stateName);

    return (
        stateViewState && (
            <DeckGLMap
                layers={layers}
                viewState={stateViewState}
                getTooltip={getTooltip}
            />
        )
    );
};

export default StateMap;
