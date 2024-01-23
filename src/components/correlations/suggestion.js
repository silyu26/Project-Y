import tracery from 'tracery-grammar';
import jstat from 'jstat';
import { Status } from '../../utils/normalRanges';

const generateSuggestion = (corrcoeff, affectingCriteria, affectedCriteria, trendOfAbnormal) => {
    if (corrcoeff == NaN || affectedCriteria == null || affectingCriteria == null || trendOfAbnormal == null) {
        return;
    }

    // Map correlation values to severity levels
    const mapCorrelationSeverity = (correlation) => {
        var absCor = Math.abs(correlation);
        if (absCor >= 0.8 && absCor <= 1) return 'very strong';
        if (absCor >= 0.6 && absCor < 0.8) return 'strong';
        if (absCor >= 0.4 && absCor < 0.6) return 'moderate';
        if (absCor >= 0.2 && absCor < 0.4) return 'weak';
        if (absCor >= 0 && absCor < 0.2) return 'very weak';
        return 'none';
    };

    // Adjust weights for each severity level
    const severityAnalysis = (correlationSeverity) => {
        switch (correlationSeverity) {
            case 'very weak': return '#AnalysisVeryWeak#';
            case 'weak': return '#AnalysisWeak#';
            case 'moderate': return '#AnalysisModerate#';
            case 'strong': return '#AnalysisStrong#';
            case 'very strong': return '#AnalysisVeryStrong#';
        }
    };

    // Decide on the #suggestion# based on correlationDirection and trendOfAbnormal
    const selectAdvice = (correlationDirection, trendOfAbnormal) => {
        if ((correlationDirection == 'positive' && trendOfAbnormal == 'high') ||
            (correlationDirection == 'negative' && trendOfAbnormal == 'low')) {
            return '#LowerAdvice#';
        } else if ((correlationDirection == 'positive' && trendOfAbnormal == 'low') ||
            (correlationDirection == 'negative' && trendOfAbnormal == 'high')) {
            return '#StrengthenAdvice#';
        }
        else if (trendOfAbnormal == 'unstable') {
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
        AffectingCriteria: ['movement', 'respiration', 'hydration', 'body temperature', 'oxygen saturation', 'heart rate', 'temperature', 'mood', 'sleep time', 'sport time'],
        AffectedCriteria: ['movement', 'respiration', 'hydration', 'body temperature', 'oxygen saturation', 'heart rate', 'temperature', 'mood', 'sleep time', 'sport time'],
        CorrelationSeverity: ['#VeryWeak', '#Weak#', '#Moderate#', '#Strong#', '#VeryStrong'],
        CorrelationDirection: ['#PositiveDirection#', '#NegativeDirection#'],

        VeryWeak: ['minimal', 'insignificant', 'trivial', 'marginal', 'inconsequential'],
        Weak: ['minor', 'slight', 'mild', 'subtle'],
        Moderate: ['moderate', 'average', 'middling', 'fair'],
        Strong: ['severe', 'significant', 'substantial', 'considerable', 'noteworthy', 'notable', 'visible', 'apparent'],
        VeryStrong: ['profound', 'remarkable', 'extraordinary', 'exceptional', 'intense', 'vigorous', 'potent', 'powerful', 'prominent'],

        PositiveDirection: ['positive', 'increasing', 'ascending', 'growing', 'upward'],
        NegativeDirection: ['negative', 'decreasing', 'descending', 'falling', 'downward'],

        AnalysisVeryWeak: [
            'The observed correlations are minimal and may not significantly impact your well-being.',
            'These correlations are considered insignificant and may not require immediate attention.',
            'Minimal adjustments to your routine may address the very weak correlations detected.',
            'The correlations observed are minor and may not necessitate drastic lifestyle changes.',
        ],
        AnalysisWeak: [
            'Consider making small adjustments to your routine.',
            'Minor correlations might not require drastic changes.',
            'Minor adjustments can make a difference in your overall well-being.',
            'Slight changes to your routine may positively impact the correlations observed.'
        ],
        AnalysisModerate: [
            'This correlation suggests a moderate impact on your lifestyle.',
            'Consider implementing moderate changes in your routine.',
            'The correlations found suggest a moderate impact on various aspects of your health.',
            'Consider making changes of moderate intensity to enhance your overall lifestyle.'
        ],
        AnalysisStrong: [
            'This correlation is significant and may require substantial lifestyle changes.',
            'Severe correlations should be addressed with careful consideration.',
            'The observed correlations indicate a significant impact that requires attention.',
            'Substantial lifestyle changes may be necessary to address these severe correlations.'
        ],
        AnalysisVeryStrong: [
            'This correlation is profound and suggests a remarkable impact on your lifestyle.',
            'The observed correlations indicate a profound impact that requires immediate attention.',
            'Remarkable lifestyle changes may be necessary to address these very strong correlations.',
            'Severe correlations demand immediate and substantial lifestyle adjustments.',
        ],

        DirectionAnalysisNegative: [
            `It appears that when ${affectingCriteria} increases, your ${affectedCriteria} tends to decrease.`,
            `An increase in your ${affectingCriteria} is associated with a decrease in ${affectedCriteria}.`,
            `There is an inverse relationship between ${affectingCriteria} and ${affectedCriteria}: as one goes up, the other goes down.`,
            `Your ${affectedCriteria} shows a negative trend when ${affectingCriteria} experiences an upward movement.`,
            `Observations suggest a negative correlation: increasing ${affectingCriteria} coincides with decreasing ${affectedCriteria}.`,
            `A negative trend is evident, indicating that an increase in ${affectingCriteria} is associated with a downward movement in ${affectedCriteria}.`,
            `There is a discernible negative trend, where rising ${affectingCriteria} coincides with a decrease in ${affectedCriteria}.`,
        ],

        DirectionAnalysisPositive: [
            `There seems to be a positive correlation between an increase in your ${affectingCriteria} and an increase in ${affectedCriteria}.`,
            `Your ${affectedCriteria} tends to increase as ${affectingCriteria} increases.`,
            `There is a positive relationship between ${affectingCriteria} and ${affectedCriteria}: as one rises, the other also rises.`,
            `Observations indicate a positive trend: increasing ${affectingCriteria} aligns with an increase in ${affectedCriteria}.`,
            `A positive correlation is evident, where an increase in ${affectingCriteria} corresponds to a rise in ${affectedCriteria}.`,
            `A positive trend is notable, suggesting that an increase in ${affectingCriteria} corresponds with an upward movement in ${affectedCriteria}.`,
            `Evidence points towards a positive trend: when ${affectingCriteria} goes up, so does ${affectedCriteria}.`,
            `The data indicates a favorable correlation, with increasing ${affectingCriteria} linked to a positive shift in ${affectedCriteria}.`,
        ],

        AbnormalMeasurementsAnalysis: [
            `Since we detect some measurements that are too ${trendOfAbnormal}, we suggest that:`,
            `Given the detected abnormally ${trendOfAbnormal} measurements, it's advisable to take the following actions:`,
            `The presence of abnormally ${trendOfAbnormal} measurements signals a need for attention. Consider the following recommendations:`,
            `Detecting abnormally ${trendOfAbnormal} measurements indicates potential issues. Here are some suggested actions:`,
            `${capitalizeFirstLetter(trendOfAbnormal)} anomalies in the measurements require consideration. We recommend taking the following steps:`,
            `Observing abnormally ${trendOfAbnormal} measurements prompts the need for proactive measures. Consider the following advice:`,
        ],

        NeutralAdvice: [
            'Your values are healthy and in shape, great job, keep up with that!',
            "Maintain your healthy lifestyle; you're doing great!",
            'Your health metrics are well within the normal range. Continue your positive habits for overall well-being.',
            "Excellent job on maintaining a healthy balance in your metrics! Keep up the good work.",
            'Your current values indicate a healthy status. Continue your healthy habits to sustain this positive outcome.',
            'Maintaining a balance in your metrics is key to overall well-being. Keep up with your current healthy habits.',
            'Your metrics suggest a balanced state. Continue with your well-rounded approach to health.',
            'Striving for a balanced lifestyle is reflected in your metrics. Keep maintaining this equilibrium for optimal health.',
        ],

        MonitorAdvice: [
            'You should continue monitoring and make adjustments as needed.',
            'Continuous monitoring is recommended to track any changes over time.',
            'Regular monitoring will provide insights into any fluctuations. Adjustments can be made accordingly.',
            'Keeping a watchful eye on your metrics is crucial for long-term health management. Make adjustments based on changes.',
            'Ongoing monitoring will help you stay proactive in maintaining your health. Adjust your routine as needed.',
        ],

        LowerAdvice: [
            `You can consider lowering your ${affectingCriteria} to improve your ${affectedCriteria}.`,
            `Lowering your ${affectingCriteria} may help in managing your ${affectedCriteria}.`,
            `Exploring strategies to decrease your ${affectingCriteria} could positively impact your ${affectedCriteria}.`,
            `Consider adjustments to lower your ${affectingCriteria} for better control over your ${affectedCriteria}.`,
            `Implementing changes to reduce your ${affectingCriteria} could contribute to improved management of your ${affectedCriteria}.`,
        ],

        StrengthenAdvice: [
            `You can consider strengthening your ${affectingCriteria} to improve your ${affectedCriteria}.`,
            `Strengthening your ${affectingCriteria} may contribute to better management of your ${affectedCriteria}.`,
            `Exploring ways to enhance your ${affectingCriteria} could positively influence your ${affectedCriteria}.`,
            `Consider strategies to strengthen your ${affectingCriteria} for improved control over your ${affectedCriteria}.`,
            `Implementing changes to boost your ${affectingCriteria} could lead to enhanced management of your ${affectedCriteria}.`,
        ],
    });

    if (corrcoeff !== undefined) {
        const correlationSeverity = mapCorrelationSeverity(corrcoeff);
        const correlationDirection = corrcoeff > 0 ? 'positive' : 'negative';

        // Use the grammar to generate suggestions
        return grammar.flatten(`${capitalizeFirstLetter(affectingCriteria)} and ${affectedCriteria} show a ${correlationSeverity} ${correlationDirection} correlation.\n` +
            `${severityAnalysis(correlationSeverity)}\n${trendAnalysis(correlationDirection)}\n${selectAdvice(correlationDirection, trendOfAbnormal)}`);
    } else {
        return 'No correlation information available for the specified attributes.';
    }
};

const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const findCorrelationsFromData = (healthData, goalId) => {
    const correlations = [];
    Object.entries(healthData).forEach(([affectedCriterionKey, affectedCriterion]) => {
        Object.entries(healthData).forEach(([affectingCriterionKey, affectingCriterion]) => {
            if (affectingCriterionKey === affectedCriterionKey || (goalId != null && affectedCriterionKey !== goalId)) {
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
            const correlationCoefficient = jstat.corrcoeff(affectingValues, affectedValues);


            const suggestion = generateSuggestion(
                correlationCoefficient,
                affectingCriterionKey,
                affectedCriterionKey,
                finalAbnormalStatus
            );

            correlations.push({
                affectingCriterionKey,
                affectedCriterionKey,
                correlationCoefficient,
                suggestion,
            });
        });
    });
    console.log(correlations);
    return correlations;
}

export { generateSuggestion, findCorrelationsFromData };