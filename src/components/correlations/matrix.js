import React, { useEffect, useState } from 'react';
import jstat from 'jstat';
import { generateSuggestion } from './suggestion';
import { Status } from './normalRanges';
import Select from 'react-select';

const healthMarkers = [
    { value: 'heart rate', label: 'Heart Rate' },
    { value: 'temperature', label: 'Body Temperature' },
    { value: 'hydration', label: 'Hydration' },
    { value: 'sport', label: 'Sport' }
    // Add more health markers as needed
];

const thresholds = [
    { label: "minor correlation", value: 0.01 },
    { label: "medium correlation", value: 0.4 },
    { label: "strong correlation", value: 0.8 }
];

const CorrelationMatrixComponent = ({ criteriaData }) => {
    const [selectedMarker, setSelectedMarker] = useState(healthMarkers[0]);
    const [maxOptionWidth, setMaxOptionWidth] = useState(0);
    const [threshold, setThreshold] = useState(thresholds[0]);
    const [correlationMatrix, setCorrelationMatrix] = useState([]);

    useEffect(() => {
        // Calculate the maximum width among all options
        const maxWidth = healthMarkers.reduce((max, option) => {
            const optionWidth = option.label.length * 12; // Adjust the multiplier as needed
            return optionWidth > max ? optionWidth : max;
        }, 0);

        setMaxOptionWidth(maxWidth);
    }, []);

    const customStyles = {
        control: (provided) => ({
            ...provided,
            width: maxOptionWidth + 20, // Add some padding for better appearance
        }),
        menu: (provided) => ({
            ...provided,
            width: maxOptionWidth + 20, // Add some padding for better appearance
        }),
    };


    useEffect(() => {
        console.log(new Date(), "Call the Correlation Matrix component");

        const correlations = [];
        // Extract values arrays from criteriaData for jstat calculation

        Object.entries(criteriaData).map(([affectingCriterionKey, affectingCriterion]) => {
            Object.entries(criteriaData).map(([affectedCriterionKey, affectedCriterion]) => {
                if (affectingCriterionKey === affectedCriterionKey) {
                    return;
                }

                const abnormalValues = [].concat(...Object.values(affectedCriterion).map(entry => entry.abnormal));
                const tooHighCount = abnormalValues.filter(status => status === Status.TOO_HIGH).length;
                const tooLowCount = abnormalValues.filter(status => status === Status.TOO_LOW).length;

                const finalAbnormalStatus =
                    tooHighCount.length > 2 && tooLowCount > 2
                        ? 'unstable'
                        : tooHighCount > 2
                            ? 'too high'
                            : tooLowCount > 2
                                ? 'too low'
                                : 'normal';

                const affectingValues = [].concat(...Object.values(affectingCriterion).map(entry => entry.value));
                const affectedValues = [].concat(...Object.values(affectedCriterion).map(entry => entry.value));
                const corrcoeff = jstat.corrcoeff(affectingValues, affectedValues);

                console.log(new Date(), "Done preparing the correlation coefficients needed for the suggestion generator");

                const suggestions = generateSuggestion(
                    corrcoeff,
                    affectingCriterionKey,
                    affectedCriterionKey,
                    finalAbnormalStatus
                );

                console.log(new Date(), "Done generating suggestion");

                correlations.push({
                    affectingCriterionKey,
                    affectedCriterionKey,
                    corrcoeff,
                    suggestions,
                });

            });
        });
        setCorrelationMatrix(correlations);
    }, [criteriaData]);



    return (
        <div className="improvement-suggestions-container" style={{ marginTop: '2vh' }}>
            <br />
            <header>
                <h2 className='text-center'>Health Improvement Suggestions</h2>
                <p className='text-center' style={{ fontStyle: 'italic' }}>Get personalized suggestions to enhance your well-being.</p>
            </header>
            <hr />
            <br />

            <section className="marker-dropdown" style={{ marginTop: '2vh', marginBottom: '5vh' }}>
                <label>Select Health Marker:</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Select
                        options={healthMarkers}
                        value={selectedMarker}
                        onChange={(healthMarker) => setSelectedMarker(healthMarker)}
                        styles={customStyles}
                    />
                    <Select
                        options={thresholds}
                        value={threshold}
                        onChange={(threshold) => setThreshold(threshold)}
                        styles={customStyles}
                    />
                </div>
            </section >
            <section className="suggestions-list">
                <h2>Suggestions to Improve {selectedMarker.label}</h2>
                <ul>
                    {correlationMatrix.filter(value => Math.abs(value.corrcoeff) >= threshold.value && value.affectedCriterionKey == selectedMarker.value)
                        .map((suggestion, index) => (
                            <li key={index} style={{ whiteSpace: 'pre-line' }}>{suggestion.suggestions}</li>
                        ))}
                </ul>
            </section>
        </div >
    );
};

export default CorrelationMatrixComponent;
