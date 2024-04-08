import { AmbientLight, PointLight, LightingEffect } from "@deck.gl/core";

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

export const lightingEffect = new LightingEffect({
    ambientLight,
    pointLight1,
    pointLight2,
});

export const material = {
    ambient: 0.64,
    diffuse: 0.6,
    shininess: 32,
    specularColor: [51, 51, 51],
};

export const MAP_STYLE =
    "https://basemaps.cartocdn.com/gl/voyager-nolabels-gl-style/style.json";

export const colorRange = [
    [1, 152, 189],
    [73, 227, 206],
    [216, 254, 181],
    [254, 237, 177],
    [254, 173, 84],
    [209, 55, 78],
];

export const mapComponentStyle = {
    height: "100vh",
    width: "60vw",
    position: "relative",
};

export const fillColors = {
    default: [131, 142, 177, 80],
    highlight: [131, 142, 177, 160],
    defaultDark: [131, 142, 177, 25],
    highlightDark: [131, 142, 177, 100],
};

export const lineColors = {
    white: [255, 255, 255, 255],
    black: [0, 0, 0, 255],
};

export const toolTipStyle = {
    backgroundColor: "#E3FEF7",
    fontSize: "0.875em",
    color: "#000",
    borderRadius: "0.5em",
    fontWeight: "500",
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
};
