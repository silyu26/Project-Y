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
    }
};

/**
 * Check the status of the provided heart rate.
 * @param {number} heartRate - The heart rate value.
 * @returns {number} - Status using enum (TOO_HIGH, TOO_LOW, NORMAL).
 */
function checkHeartRateStatus(heartRate) {
    const { min, max } = normalRanges.heartRate;

    if (heartRate > max) {
        return Status.TOO_HIGH;
    } else if (heartRate < min) {
        return Status.TOO_LOW;
    } else {
        return Status.NORMAL;
    }
}

/**
 * Check the status of the provided temperature in Celsius.
 * @param {number} temperatureCelsius - The temperature value in Celsius.
 * @returns {number} - Status using enum (TOO_HIGH, TOO_LOW, NORMAL).
 */
function checkTemperatureStatus(temperatureCelsius) {
    const { min, max } = normalRanges.temperatureCelsius;

    if (temperatureCelsius > max) {
        return Status.TOO_HIGH;
    } else if (temperatureCelsius < min) {
        return Status.TOO_LOW;
    } else {
        return Status.NORMAL;
    }
}

function checkHydrationStatus(hydration){
    const { min, max } = normalRanges.hydration;

    if (hydration > max) {
        return Status.TOO_HIGH;
    } else if (hydration < min) {
        return Status.TOO_LOW;
    } else {
        return Status.NORMAL;
    }
}

export {
    Status,
    checkHeartRateStatus,
    checkTemperatureStatus,
    checkHydrationStatus
};
