import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Spinner from 'react-bootstrap/Spinner';
import { Carousel } from "react-bootstrap";
import { SuggestionComponent, findCorrelationsFromData } from './suggestion';
import { FaFaceGrinBeamSweat } from "react-icons/fa6";


const healthMarkers = [
    { value: 'heart rate', label: 'Heart Rate' },
    { value: 'temperature', label: 'Body Temperature' },
    { value: 'hydration', label: 'Hydration' },
    { value: 'sport time', label: 'Sport Time' },
    { value: 'sport level', label: 'Sport Intensity' },
    { value: 'mood', label: 'Mood' },
    { value: 'sleep', label: 'Sleep Time' }
    // Add more health markers as needed
];

const getLabel = (value) => {
    const labelMap = {
      'heart rate': 'Heart Rate',
      'temperature': 'Body Temperature',
      'hydration': 'Hydration',
      'sport time': 'Sport Time',
      'sport level': 'Sport Intensity',
      'mood': 'Mood',
      'sleep': 'Sleep Time'
      // Add more mappings as needed
    };
    return labelMap[value] || value;
  };

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

    const getSuggestions = (suggestionObj, affectingCriterionKey, threshold) => {
        return suggestionObj.filter(value => value.affectingCriterionKey == affectingCriterionKey && Math.abs(value.correlationCoefficient) >= threshold)
            .sort((a, b) => b.correlationCoefficient - a.correlationCoefficient);
    };

    return (
        <div className="improvement-suggestions-container" style={{ marginTop: '2vh' }}>
            <br />
            <header>
                <h2 className='text-center'>Health Improvement Suggestions</h2>
                <p className='text-center' style={{ fontStyle: 'italic' }}>Get personalized suggestions to enhance your well-being.</p>
            </header>
            <hr />
            <br />

            <section className="marker-dropdown" style={{ marginTop: '2vh', marginBottom: '5vh', position: 'relative', zIndex: 1 }}>
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
            </section>
            <section className="suggestions-list" style={{ position: 'relative', zIndex: 0 }}>
                {loading ? (
                    <div className='text-center'>
                        <Spinner variant='info' animation="border" />
                        <p>Loading Suggestions...</p>
                    </div>
                ) : getSuggestions(correlationMatrix, selectedMarker.value, threshold).length > 0 ? (
                    <Carousel data-bs-theme="dark" interval={null} indicator="false" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {getSuggestions(correlationMatrix, selectedMarker.value, threshold).map((item, index) => (
                            <Carousel.Item key={index}>
                                <div style={{ padding: '50px 150px 50px 150px' }}>
                                    <h5>Possible effect of {selectedMarker.label} on {getLabel(item.affectedCriterionKey)}:</h5>
                                    <SuggestionComponent corrcoeff={item.correlationCoefficient} affectingCriteria={item.affectingCriterionKey} affectedCriteria={item.affectedCriterionKey} trendOfAbnormal={item.finalAbnormalStatus} />
                                </div>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                ) : (
                    <p className='text-center' style={{ fontStyle: 'italic' }}>No correlation found for this health marker! <FaFaceGrinBeamSweat /></p>
                )}
            </section>
        </div>

    );
};

export default CorrelationMatrixComponent;