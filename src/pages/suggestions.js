// Import necessary React components and styles
import React, { useState, useEffect } from 'react';
import Select from 'react-select';


// Dummy data for health markers and suggestions
const healthMarkers = [
  { value: 'Sleep Duration', label: 'Sleep Duration' },
  { value: 'Daily Steps', label: 'Daily Steps' },
  { value: 'Heart Rate', label: 'Heart Rate' },
  // Add more health markers as needed
];

const suggestionData = {
  'Sleep Duration': [
    'Establish a consistent sleep schedule.',
    'Create a relaxing bedtime routine.',
    'Limit screen time before bedtime.',
  ],
  'Daily Steps': [
    'Take short walks during breaks.',
    'Use stairs instead of the elevator.',
    'Consider joining a walking group or fitness class.',
  ],
  'Heart Rate': [
    'Engage in regular cardiovascular exercises.',
    'Practice deep breathing exercises.',
    'Monitor stress levels and practice stress management techniques.',
  ],
  // Add more suggestions for other health markers
};

const Suggestion = () => {
  const [selectedMarker, setSelectedMarker] = useState(healthMarkers[0]);
  const [maxOptionWidth, setMaxOptionWidth] = useState(0);

  useEffect(() => {
    // Calculate the maximum width among all options
    const maxWidth = healthMarkers.reduce((max, option) => {
      const optionWidth = option.label.length * 12; // Adjust the multiplier as needed
      return optionWidth > max ? optionWidth : max;
    }, 0);

    setMaxOptionWidth(maxWidth);
  }, []);

  const handleMarkerChange = (selectedOption) => {
    setSelectedMarker(selectedOption);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: maxOptionWidth + 20, // Add some padding for better appearance
    }),
  };

  return (
    <div className="improvement-suggestions-container">
      <header>
        <h1>Health Improvement Suggestions</h1>
        <p>Get personalized suggestions to enhance your well-being.</p>
      </header>

      <section className="marker-dropdown">
        <label>Select Health Marker:</label>
        <Select
          options={healthMarkers}
          value={selectedMarker}
          onChange={handleMarkerChange}
          styles={customStyles}
        />
      </section>

      <section className="suggestions-list">
        <h2>Suggestions to Improve {selectedMarker.label}</h2>
        <ul>
          {suggestionData[selectedMarker.value].map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Suggestion;
