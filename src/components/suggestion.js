import React, { useEffect } from 'react';
import tracery from 'tracery-grammar';

const SuggestionComponent = () => {

    const generateSuggestion = (correlationResults, affectingCriteria, affectedCriteria, trendOfAbnormal) => {
        const suggestions = [];

        // Map correlation values to severity levels
        const mapCorrelationSeverity = (correlation) => {
            var absCor = Math.abs(correlation);
            if (absCor >= 0.8 && absCor <= 1) return 'strong';
            if (absCor >= 0.4 && absCor < 0.8) return 'moderate';
            if (absCor > 0 && absCor < 0.4) return 'weak';
            return 'none';
        };

        // Adjust weights for each severity level
        const severityAnalysis = (correlationSeverity) => {
            if (correlationSeverity === 'weak') {
                return '#AnalysisWeak#';
            } else if (correlationSeverity === 'moderate') {
                return '#AnalysisModerate#';
            } else if (correlationSeverity === 'strong') {
                return '#AnalysisStrong#';
            }
        };

        // Decide on the #suggestion# based on correlationDirection and trendOfAbnormal
        const selectAdvice = (correlationDirection, trendOfAbnormal) => {
            if ((correlationDirection === 'Positive' && trendOfAbnormal === 'too high') ||
                (correlationDirection === 'Negative' && trendOfAbnormal === 'too low')) {
                return '#LowerAdvice#';
            } else if ((correlationDirection === 'Positive' && trendOfAbnormal === 'too low') ||
                (correlationDirection === 'Negative' && trendOfAbnormal === 'too high')) {
                return '#StrengthenAdvice#';
            }
            else {
                return '#NeutralAdvice#';
            }
        };

        const trendAnalysis = (direction) => {
            if (direction === "Positive") {
                return '#DirectionAnalysisPositive#';
            }
            else {
                return '#DirectionAnalysisNegative#';
            }
        }

        const grammar = tracery.createGrammar({
            AffectingCriteria: ['movement', 'respiration', 'hydration', 'bodyTemperature', 'oxygenSaturation', 'heartRate', 'temperature'],
            AffectedCriteria: ['movement', 'respiration', 'hydration', 'bodyTemperature', 'oxygenSaturation', 'heartRate', 'temperature'],
            CorrelationSeverity: ['#Weak#', '#Moderate#', '#Strong#'],
            CorrelationDirection: ['#PositiveDirection#', '#NegativeDirection#'],
            Weak: ['minor', 'slight'],
            Moderate: ['moderate', 'reasonable'],
            Strong: ['severe', 'significant'],
            PositiveDirection: ['positive', 'increasing'],
            NegativeDirection: ['negative', 'decreasing'],
            AnalysisWeak: [
                'Consider making small adjustments to your routine.',
                'Minor correlations might not require drastic changes.',
            ],
            AnalysisModerate: [
                'This correlation suggests a moderate impact on your lifestyle.',
                'Consider implementing moderate changes in your routine.',
            ],
            AnalysisStrong: [
                'This correlation is significant and may require substantial lifestyle changes.',
                'Severe correlations should be addressed with careful consideration.',
            ],
            DirectionAnalysisNegative: [
                `It appears that when ${affectingCriteria} increases, your ${affectedCriteria} tends to decrease.`,
                `An increase in your ${affectingCriteria} is associated with a decrease in ${affectedCriteria}.`,
                // Add more rules based on your analysis for negative trends
            ],
            DirectionAnalysisPositive: [
                `There seems to be a positive correlation between an increase in your ${affectingCriteria} and an increase in ${affectedCriteria}.`,
                `Your ${affectedCriteria} tends to increase as ${affectingCriteria} increases.`,
                // Add more rules based on your analysis for positive trends
            ],
            AbnormalMeasurementsAnalysis: [
                `Since we detect some measurements that are ${trendOfAbnormal}, we suggest that:`,
                // Customize the message based on the trendOfAbnormal variable
            ],
            NeutralAdvice: [
                'You should continue monitoring and make adjustments as needed.',
            ],
            LowerAdvice: [
                `You can consider lowering your ${affectingCriteria} to improve your ${affectedCriteria}.`,
                `Lowering your ${affectingCriteria} may help in managing your ${affectedCriteria}.`,
            ],
            StrengthenAdvice: [
                `You can consider strengthening your ${affectingCriteria} to improve your ${affectedCriteria}.`,
                `Strengthening your ${affectingCriteria} may contribute to better management of your ${affectedCriteria}.`,
            ],
        });

        // Get the correlation value based on the provided attributes
        const correlationKey = `${affectingCriteria}_${affectedCriteria}`;
        const correlation = correlationResults[correlationKey];

        if (correlation !== undefined) {
            const correlationSeverity = mapCorrelationSeverity(correlation);
            const correlationDirection = correlation > 0 ? 'positive' : 'negative';

            // Use the grammar to generate suggestions
            suggestions.push(grammar.flatten(`${affectingCriteria} and ${affectedCriteria} show a ${correlationSeverity} ${correlationDirection} correlation. ` +
                `${severityAnalysis(correlationSeverity)} ${trendAnalysis(correlationDirection)} ${selectAdvice(correlationDirection, trendOfAbnormal)}`));
            return suggestions;
        } else {
            suggestions.push('No correlation information available for the specified attributes.');
            return suggestions;
        }
    };


    // Example usage
    useEffect(() => {
        // Replace these with your actual correlation values and abnormal trend
        const correlationResults = {
            movement_heartRate: 0.8,
            respiration_hydration: -0.4,
            // Add more correlation results based on your analysis
        };

        const trendOfAbnormal = 'too high'; // Replace with your actual trendOfAbnormal value

        const affectingCriteria = 'movement';
        const affectedCriteria = 'heartRate';

        console.log('Generated Suggestions:', generateSuggestion(correlationResults, affectingCriteria, affectedCriteria, trendOfAbnormal));
        console.log('Generated Suggestions:', generateSuggestion(correlationResults, "respiration", "hydration", "too low"));
    }, []);
};

export default SuggestionComponent;