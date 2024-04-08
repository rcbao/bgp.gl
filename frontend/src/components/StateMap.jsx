import { HexagonLayer, ContourLayer } from "@deck.gl/aggregation-layers";
import { GeoJsonLayer } from "@deck.gl/layers";
import { fillColors, lineColors, toolTipStyle } from "./utils/constants";
import { findStateByAbbreviation } from "./utils/utils";
import usStatesGeoJson from "./us-states.json";
import DeckGLMap from "./DeckGLMap";

const getStateViewState = (stateAbbr) => {
    const stateObj = findStateByAbbreviation(stateAbbr);
    const center = stateObj.properties.center;

    const viewState = {
        longitude: center.longitude,
        latitude: center.latitude,
        zoom: 6,
        minZoom: 4,
        maxZoom: 15,
        pitch: 40.5,
        bearing: -27,
    };
    return [stateObj.id, viewState];
};

const getTooltip = ({ object }) => {
    if (!object) {
        return null;
    }
    const lat = object.position[1];
    const lng = object.position[0];

    return (
        object && {
            html: `<div>Latitude: ${
                Number.isFinite(lat) ? lat.toFixed(4) : ""
            }<br/>
            Longitude: ${Number.isFinite(lng) ? lng.toFixed(4) : ""}<br/>
            ${object.elevationValue} announcements</div>`,
            style: toolTipStyle,
        }
    );
};

const StateMap = ({ data, stateName, radius = 2000, coverage = 1 }) => {
    const USE_CONTOUR_MAP = false;

    if (!data) {
        console.log("Waiting for data...");
        return null; // Return null or a loading indicator while data is being fetched
    }

    const [selectedStateId, stateViewState] = getStateViewState(stateName);

    const getDataLayer = () => {
        if (!USE_CONTOUR_MAP) {
            return new HexagonLayer({
                id: "HexagonLayer",
                data: data,
                colorRange: [
                    [1, 152, 189],
                    [73, 227, 206],
                    [216, 254, 181],
                    [254, 237, 177],
                    [254, 173, 84],
                    [209, 55, 78],
                ],
                extruded: true,
                getPosition: (d) => [d.long, d.lat],
                getColorWeight: (d) => d.count,
                getElevationWeight: (d) => d.count,
                elevationAggregation: "SUM",
                elevationScale: 128,
                radius: radius,
                coverage: coverage,
                pickable: true,
                material: {
                    ambient: 0.64,
                    diffuse: 0.6,
                    shininess: 32,
                    specularColor: [51, 51, 51],
                },
            });
        } else {
            return new ContourLayer({
                id: "ContourLayer",
                data: data,

                cellSize: radius,
                contours: [
                    {
                        threshold: 1,
                        color: [255, 0, 0],
                        strokeWidth: 2,
                        zIndex: 1,
                    },
                    { threshold: [3, 10], color: [55, 0, 55], zIndex: 0 },
                    {
                        threshold: 5,
                        color: [0, 255, 0],
                        strokeWidth: 6,
                        zIndex: 2,
                    },
                    {
                        threshold: 15,
                        color: [0, 0, 255],
                        strokeWidth: 4,
                        zIndex: 3,
                    },
                ],
                getPosition: (d) => [d.long, d.lat],
                getWeight: (d) => d.count,
                pickable: true,
            });
        }
    };

    const layers = [
        getDataLayer(),
        new GeoJsonLayer({
            id: "geojson-layer",
            data: usStatesGeoJson,
            stroked: true,
            filled: true,
            lineWidthMinPixels: 2,
            getFillColor: (d) =>
                d.id === selectedStateId
                    ? fillColors.highlightDark
                    : fillColors.defaultDark,
            getLineColor: lineColors.white,
        }),
    ];

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
