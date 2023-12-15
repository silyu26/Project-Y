import React, { useEffect, useState } from 'react';
import jstat from 'jstat';
import { generateSuggestion } from './suggestion';
import { Status } from './normalRanges';

const CorrelationMatrixComponent = ({ criteriaData }) => {
    const [threshold, setThreshold] = useState(0.3);
    const [correlationMatrix, setCorrelationMatrix] = useState([]);


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

                // Check if the correlation coefficient is above the threshold
                if (Math.abs(corrcoeff) >= threshold) {

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
                    max={1}
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
