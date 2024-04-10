import React, { useState } from "react";
import { GeoJsonLayer } from "@deck.gl/layers";
import usStatesGeoJson from "./us-states.json";
import DeckGLMap from "./DeckGLMap";
import { fillColors, lineColors, toolTipStyle } from "./utils/constants";

export const overviewViewState = {
    longitude: -97,
    latitude: 40,
    zoom: 3.3,
    maxZoom: 10,
};

const getColorFromAnnouncements = (announcements) => {
    if (announcements < 5000) {
        return [221, 221, 221, 200]; // Basically grey
    } else if (announcements < 10000) {
        return [180, 229, 255, 190]; // Very light blue
    } else if (announcements < 25000) {
        return [153, 204, 255, 200]; // Light blue
    } else if (announcements < 50000) {
        return [102, 178, 255, 200]; // Medium light blue
    } else if (announcements < 100000) {
        return [51, 153, 255, 200]; // Medium dark blue
    } else if (announcements < 250000) {
        return [0, 128, 255, 200]; // Dark blue
    } else if (announcements < 400000) {
        return [0, 102, 204, 200]; // Darker blue
    } else {
        return [0, 51, 153, 200]; // Darkest blue, for announcements >= 400000
    }
};

// attempt at heat gradient with other colors, but not sure if it looks good...
// const getColorFromAnnouncements = (announcements) => {
//    if (announcements < 25000) {
//        return [29,72,119, 200]; // Blue
//    } else if (announcements < 50000) {
//        return [27,138,90, 200]; // Green
//    } else if (announcements < 100000) {
//        return [230,170,30, 200]; // Yellow
//    } else if (announcements < 300000) {
//        return [246,136,56, 200]; // Orange
//    } else if (announcements < 400000) {
//        return [238,62,50, 200]; // Red
//    } else {
//        return [139, 0, 0, 200]; // Dark red for >= 400000
//    }
//};

const OverviewMap = (props) => {
    const data = props.data;
    const navigate = props.navigate;

    if (!data || !data["usAnnouncementHeatMap"]) {
        return null; // Return null or a loading indicator while data is being fetched
    }

    const getTooltip = ({ object }) => {
        if (!object) {
            return null;
        }
        const stateName = object.properties.name;
        const stateAbbr = object.properties.abbreviation;
        const announcements = data["usAnnouncementHeatMap"][stateName];

        return (
            object && {
                html: `<div>${stateName} (${stateAbbr.toUpperCase()})<br/> ${
                    announcements || 0
                } announcements</div>`,
                style: toolTipStyle,
            }
        );
    };

    const [viewState, setViewState] = useState(overviewViewState);

    const resetMap = () =>
        setViewState({
            ...overviewViewState,
            latitude: overviewViewState.latitude + Math.random() * 0.001,
        });

    const layers = [
        new GeoJsonLayer({
            id: "geojson-layer",
            data: usStatesGeoJson,
            stroked: true,
            filled: true,
            lineWidthMinPixels: 2,
            getFillColor: (feature) => {
                const stateName = feature.properties.name; // Adjust based on your GeoJSON structure
                const announcements =
                    data["usAnnouncementHeatMap"][stateName] || 0; // Fallback to 0 if no data
                // Implement your logic to map `announcements` to a color
                return getColorFromAnnouncements(announcements);
            },
            getLineColor: lineColors.white,
            autoHighlight: true,
            highlightColor: fillColors.highlight,
            pickable: true,
            material: {
                ambient: 0.64,
                diffuse: 0.6,
                shininess: 32,
                specularColor: [51, 51, 51],
            },
            onClick: ({ object, x, y }) => {
                if (object) {
                    const stateAbbr = object.properties.abbreviation;
                    if (stateAbbr !== "pr") {
                        navigate(`/${stateAbbr}`);
                    }
                }
            },
        }),
    ];
    return (
        data && (
            <div>
                <DeckGLMap
                    layers={layers}
                    viewState={viewState}
                    getTooltip={getTooltip}
                    onViewStateChange={({ viewState }) =>
                        setViewState(viewState)
                    }
                />
                <button
                    className="absolute bottom-5 left-5 z-50 cursor-pointer"
                    onClick={() => {
                        resetMap();
                    }}
                >
                    <h3 className="float-left font-bold text-lg text-black rounded-lg">
                        Recenter Map
                    </h3>
                </button>
            </div>
        )
    );
};
export default OverviewMap;
