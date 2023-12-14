import React from 'react';
import CorrelationMatrixComponent from '../components/matrix';

const MockCriteriaData = {
  'movement': {
    values: [1, 2, 3, 4, 5],
    abnormal: 'too high',
  },
  'respiration': {
    values: [5, 4, 3, 2, 1],
    abnormal: 'too low',
  },
  'hydration': {
    values: [3, 2, 4, 5, 1],
    abnormal: 'too high',
  },
  'bodyTemperature': {
    values: [4, 5, 3, 1, 2],
    abnormal: 'too low',
  },
  'oxygenSaturation': {
    values: [2, 3, 1, 4, 5],
    abnormal: 'too high',
  },
  'heartRate': {
    values: [5, 1, 2, 4, 3],
    abnormal: 'too low',
  },
  'temperature': {
    values: [3, 4, 1, 5, 2],
    abnormal: 'too high',
  },
};

const CorrelationMatrixWithSuggestions = () => {
  return (
    <div>
      <h2>Correlation Matrix with Suggestions</h2>
      <CorrelationMatrixComponent criteriaData={MockCriteriaData} />
    </div>
  );
};

export default CorrelationMatrixWithSuggestions;