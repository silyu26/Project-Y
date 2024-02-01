const Status = {
    TOO_HIGH: 1,
    TOO_LOW: -1,
    NORMAL: 0,
};

const normalRanges = {
    heartRate: {
        min: 60,
        max: 100,
    },
    temperatureCelsius: {
        min: 25.5,
        max: 26.5,
    },
    //TODO: what values to use here?
    hydration: {
        min: -1,
        max: 1,
    },
    mood: {
        min: 3,
        max: 8
    },
    sleep: {
        min: 420,
        max: 540
    },
    sportLevel: {
        min: 3,
        max: 7
    },
    sportTime: {
        min: 10,
        max: 120
    }

};


/**
 * Check the status of the provided health criteria.
 * @param {*} attribute - chosen health criteria
 * @param {*} value - value of the chosen criteria.
 * @returns - Status using enum (TOO_HIGH, TOO_LOW, NORMAL).
 */
function checkStatus(attribute, value) {
    const { min, max } = normalRanges[attribute];

    if (value > max) {
        return Status.TOO_HIGH;
    } else if (value < min) {
        return Status.TOO_LOW;
    } else {
        return Status.NORMAL;
    }
}

export {
    Status,
    checkStatus
};
