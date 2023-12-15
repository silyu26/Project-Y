import tracery from 'tracery-grammar';

const generateSuggestion = (corrcoeff, affectingCriteria, affectedCriteria, trendOfAbnormal) => {
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
        if ((correlationDirection == 'positive' && trendOfAbnormal == 'too high') ||
            (correlationDirection == 'negative' && trendOfAbnormal == 'too low')) {
            return '#LowerAdvice#';
        } else if ((correlationDirection == 'positive' && trendOfAbnormal == 'too low') ||
            (correlationDirection == 'negative' && trendOfAbnormal == 'too high')) {
            return '#StrengthenAdvice#';
        }
        else if (trendOfAbnormal == 'unstable'){
            return '#MonitorAdvice#';
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
        AffectingCriteria: ['movement', 'respiration', 'hydration', 'body temperature', 'oxygen saturation', 'heart rate', 'temperature'],
        AffectedCriteria: ['movement', 'respiration', 'hydration', 'body temperature', 'oxygen saturation', 'heart rate', 'temperature'],
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
            'Your values are healthy and in shape, great job, keep up with that!',
        ],
        MonitorAdvice: [
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

    if (corrcoeff !== undefined) {
        const correlationSeverity = mapCorrelationSeverity(corrcoeff);
        const correlationDirection = corrcoeff > 0 ? 'positive' : 'negative';

        // Use the grammar to generate suggestions
        suggestions.push(grammar.flatten(`${capitalizeFirstLetter(affectingCriteria)} and ${affectedCriteria} show a ${correlationSeverity} ${correlationDirection} correlation. ` +
            `${severityAnalysis(correlationSeverity)} ${trendAnalysis(correlationDirection)} ${selectAdvice(correlationDirection, trendOfAbnormal)}`));
        return suggestions;
    } else {
        suggestions.push('No correlation information available for the specified attributes.');
        return suggestions;
    }
};

const  capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


export { generateSuggestion };