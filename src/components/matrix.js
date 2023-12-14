import React, { useEffect, useState } from 'react';
import jstat from 'jstat';
import { generateSuggestion } from './suggestion';

const CorrelationMatrixComponent = ({ criteriaData }) => {
    const [threshold, setThreshold] = useState(0.5);
    const [correlationMatrix, setCorrelationMatrix] = useState([]);


    useEffect(() => {
        const correlations = [];
        // Extract values arrays from criteriaData for jstat calculation

        Object.entries(criteriaData).map(([affectingCriterionKey, affectingCriterion]) => {
            Object.entries(criteriaData).map(([affectedCriterionKey, affectedCriterion]) => {
                if (affectingCriterionKey === affectedCriterionKey) {
                    return;
                }
                const corrcoeff = jstat.corrcoeff(affectingCriterion.values, affectedCriterion.values);

                // Check if the correlation coefficient is above the threshold
                if (Math.abs(corrcoeff) > threshold) {

                    const suggestions = generateSuggestion(
                        corrcoeff,
                        affectingCriterionKey,
                        affectedCriterionKey,
                        affectedCriterion.abnormal
                    );

                    correlations.push({
                        affectingCriterionKey,
                        affectedCriterionKey,
                        corrcoeff,
                        suggestions,
                    });
                }
            });
        });
        setCorrelationMatrix(correlations);
    }, [criteriaData, threshold]);


    // Return your correlation matrix in a simple table form
    // TODO: make it look nicer in the UI :D
    return (
        <div>
            <label>
                Threshold:
                <input
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    step={0.1}
                />
            </label>

            <h2>Correlation Matrix:</h2>
            <table>
                <thead>
                    <tr>
                        <th>Affecting Criterion</th>
                        <th>Affected Criterion</th>
                        <th>Correlation Coefficient</th>
                        <th>Suggestions</th>
                    </tr>
                </thead>
                <tbody>
                    {correlationMatrix.map((correlation, index) => (
                        <tr key={index}>
                            <td>{correlation.affectingCriterionKey}</td>
                            <td>{correlation.affectedCriterionKey}</td>
                            <td>{correlation.corrcoeff.toFixed(2)}</td>
                            <td>{correlation.suggestions}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CorrelationMatrixComponent;
