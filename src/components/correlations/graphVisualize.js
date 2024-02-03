import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import GraphComponent from './graph';

const healthMarkers = [
    { value: 'heart rate', label: 'Heart Rate' },
    { value: 'temperature', label: 'Skin Temperature' },
    { value: 'hydration', label: 'Hydration' },
    { value: 'sport', label: 'Sport' }
    // Add more health markers as needed
];

const diagramTypes = [
    { value: 'scatter', label: 'Scatter' },
    { value: 'line', label: 'Line' },
    { value: 'bubble', label: 'Bubble' },
    { value: 'bar', label: 'Bar' },
    //{ value: 'radar', label: 'Radar' },
    //{ value: 'polarArea', label: 'Polar Area' },
]

const GraphVisualizeComponent = ({ criteriaData }) => {
    const [selectedAffecting, setSelectedAffecting] = useState(healthMarkers[0]);
    const [selectedAffected, setSelectedAffected] = useState(healthMarkers[0]);
    const [maxOptionWidth, setMaxOptionWidth] = useState(0);
    const [currentDiagramType, setCurrentDiagramType] = useState(diagramTypes[0]);

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

    return (
        <div className="graphs-container" style={{ marginTop: '2vh' }}>
            <br />
            <header>
                <h2 className='text-center'>Correlation graph</h2>
                <p className='text-center' style={{ fontStyle: 'italic' }}>Browse how different parts of your health data correlate to each other. Click the button at the bottom to start.</p>
            </header>
            <hr />
            <br />
            <section className="marker-dropdown" style={{ marginTop: '2vh', marginBottom: '5vh' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Select
                        options={healthMarkers}
                        value={selectedAffecting}
                        onChange={(healthMarker) => setSelectedAffecting(healthMarker)}
                        styles={customStyles}
                        label={"Select Affecting Factor:"}
                    />
                    <Select
                        options={healthMarkers}
                        value={selectedAffected}
                        onChange={(healthMarker) => setSelectedAffected(healthMarker)}
                        styles={customStyles}
                        label={"Select Affected Factor:"}
                    />
                    <Select
                        options={diagramTypes}
                        value={currentDiagramType}
                        onChange={(type) => setCurrentDiagramType(type)}
                        styles={customStyles}
                        label={"Diagram type:"}
                    />

                </div>
            </section >
            <GraphComponent dataset={criteriaData} selectedX={selectedAffecting} selectedY={selectedAffected} type={currentDiagramType} />
        </div >
    );
};

export default GraphVisualizeComponent;
