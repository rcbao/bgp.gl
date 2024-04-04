import usStatesGeoJson from "../us-states.json";

export const findStateByAbbreviation = (abbreviation) => {
    const features = usStatesGeoJson.features;
    const stateObj = features.find(
        (f) => f.properties.abbreviation === abbreviation
    );
    return stateObj;
};
