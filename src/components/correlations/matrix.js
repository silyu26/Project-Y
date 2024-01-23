import React, { useEffect, useState } from 'react';
import { findCorrelationsFromData } from './suggestion';
import Select from 'react-select';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Spinner from 'react-bootstrap/Spinner';

const healthMarkers = [
    { value: 'heart rate', label: 'Heart Rate' },
    { value: 'temperature', label: 'Body Temperature' },
    { value: 'hydration', label: 'Hydration' },
    { value: 'sport', label: 'Sport' }
    // Add more health markers as needed
];

const thresholds = {
    min: 0,
    max: 1,
    step: 0.01,
};

const CorrelationMatrixComponent = ({ criteriaData }) => {
    const [selectedMarker, setSelectedMarker] = useState(healthMarkers[0]);
    const [maxOptionWidth, setMaxOptionWidth] = useState(0);
    const [threshold, setThreshold] = useState(thresholds.min);
    const [correlationMatrix, setCorrelationMatrix] = useState([]);
    const [loading, setLoading] = useState(false);

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
        setLoading(true);

        setCorrelationMatrix(findCorrelationsFromData(criteriaData, null));

        setTimeout(() => {
            setLoading(false);
        }, 2000); // Simulating a 2-second delay

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
                    <div className="threshold-slider">
                        <Slider
                            min={thresholds.min}
                            max={thresholds.max}
                            step={thresholds.step}
                            value={threshold}
                            onChange={(value) => setThreshold(value)}
                        />
                        <label style={{ marginRight: '10px' }}>Correlation Threshold:</label>
                    </div>
                </div>
            </section >
            <section className="suggestions-list">
                {loading ? (
                    <div className='text-center'>
                        <Spinner variant='info' animation="border" />
                        <p>Loading Suggestions...</p>
                    </div>
                ) : (
                    <>
                        <h2>Suggestions to Improve {selectedMarker.label}</h2>
                        <ul>
                            {correlationMatrix.filter(value => Math.abs(value.corrcoeff) >= threshold && value.affectedCriterionKey == selectedMarker.value)
                                .map((suggestion, index) => (
                                    <li key={index} style={{ whiteSpace: 'pre-line' }}>{suggestion.suggestions}</li>
                                ))}
                        </ul>
                    </>
                )}
            </section>
        </div >
    );
};

export default CorrelationMatrixComponent;