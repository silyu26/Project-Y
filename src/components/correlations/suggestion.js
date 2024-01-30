import tracery from 'tracery-grammar';
import jstat from 'jstat';
import { Status } from '../../utils/normalRanges';
import { HiOutlineKey } from "react-icons/hi";
import { HiBell } from 'react-icons/hi';
import { HiInformationCircle } from 'react-icons/hi';
import { HiExclamation } from "react-icons/hi";
import { Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';

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
    if ((correlationDirection == 'positive' && trendOfAbnormal == 'too high') ||
        (correlationDirection == 'negative' && trendOfAbnormal == 'too low')) {
        return '#LowerAdvice#';
    } else if ((correlationDirection == 'positive' && trendOfAbnormal == 'too low') ||
        (correlationDirection == 'negative' && trendOfAbnormal == 'too high')) {
        return '#StrengthenAdvice#';
    }
    else if (trendOfAbnormal == 'unstable') {
        return '#MonitorAdvice#';
    }
    else {
        return '#NeutralAdvice#';
    }
};

const detailedAdvice = (affectedCriteria, trend) => {
    if (trend == "too high") {
        switch (affectedCriteria) {
            case 'movement':
                return '#HighMovement#';
            case 'respiration':
                return '#HighRespiration#';
            case 'hydration':
                return '#HighHydration#';
            case 'body temperature':
                return '#HighTemperature#';
            case 'oxygen saturation':
                return '#HighOxygenSaturation#';
            case 'heart rate':
                return '#HighHeartRate#';
            case 'temperature':
                return '#HighTemperature#';
            case 'mood':
                return '#HighMood#';
            case 'sleep time':
                return '#HighSleepTime#';
            case 'sport time':
                return '#HighSportTime#';
        }
    }
    else if (trend == "too low") {
        switch (affectedCriteria) {
            case 'movement':
                return '#LowMovement#';
            case 'respiration':
                return '#LowRespiration#';
            case 'hydration':
                return '#LowHydration#';
            case 'body temperature':
                return '#LowTemperature#';
            case 'oxygen saturation':
                return '#LowOxygenSaturation#';
            case 'heart rate':
                return '#LowHeartRate#';
            case 'temperature':
                return '#LowTemperature#';
            case 'mood':
                return '#LowMood#';
            case 'sleep time':
                return '#LowSleepTime#';
            case 'sport time':
                return '#LowSportTime#';
        }
    }
    return;
}

const trendAnalysis = (direction) => {
    if (direction === "positive") {
        return '#DirectionAnalysisPositive#';
    }
    else {
        return '#DirectionAnalysisNegative#';
    }
}

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

            correlations.push({
                correlationCoefficient,
                affectingCriterionKey,
                affectedCriterionKey,
                finalAbnormalStatus
            });
        });
    });
    return correlations;
}

const SuggestionComponent = ({ corrcoeff, affectingCriteria, affectedCriteria, trendOfAbnormal }) => {

    const [info, setInfo] = useState("");
    const [detectedValue, setDetectedValue] = useState("");
    const [change, setChange] = useState("");
    const [possibilities, setPossibilities] = useState("");

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
            `Observations suggest that, increasing ${affectingCriteria} coincides with decreasing ${affectedCriteria}.`,
            `A negative trend is evident, indicating that an increase in ${affectingCriteria} is associated with a downward movement in ${affectedCriteria}.`,
            `There is a negative trend, where rising ${affectingCriteria} coincides with a decrease in ${affectedCriteria}.`,
        ],

        DirectionAnalysisPositive: [
            `Your ${affectedCriteria} tends to increase as ${affectingCriteria} increases.`,
            `There is a positive relationship between ${affectingCriteria} and ${affectedCriteria}: as one rises, the other also rises.`,
            `Observations indicate a positive trend: increasing ${affectingCriteria} aligns with an increase in ${affectedCriteria}.`,
            `A positive trend is evident, where an increase in ${affectingCriteria} corresponds to a rise in ${affectedCriteria}.`,
            `Observations suggest that, an increase in ${affectingCriteria} corresponds with an upward movement in ${affectedCriteria}.`,
            `Evidence points towards a positive trend: when ${affectingCriteria} goes up, so does ${affectedCriteria}.`,
            `The data indicates a positive relationship, with increasing ${affectingCriteria} linked to a positive shift in ${affectedCriteria}.`,
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
            'Unstable values are detected, you should continue monitoring and make adjustments as needed.',
            'Unstable values are detected, continuous monitoring is recommended to track any changes over time.',
            'Unstable values are detected, regular monitoring will provide insights into any fluctuations. Adjustments can be made accordingly.',
            'Unstable values are detected, keeping a watchful eye on your metrics is crucial for long-term health management. Make adjustments based on changes.',
            'Unstable values are detected, ongoing monitoring will help you stay proactive in maintaining your health. Adjust your routine as needed.',
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
        HighMovement: [
            'Excessive movement or strenuous activity without proper rest can result in fatigue, injuries, or muscle strain.'
        ],
        HighRespiration: [
            'Rapid or labored breathing may indicate respiratory distress or underlying health issues.'
        ],
        HighHydration: [
            'Overhydration may result in electrolyte imbalances and, in severe cases, hyponatremia.'
        ],
        HighTemperature: [
            'Low body temperature may suggest hypothermia, which can lead to confusion, shivering, and, in severe cases, organ failure.'
        ],
        HighOxygenSaturation: [
            'Monitoring oxygen saturation is crucial for individuals with respiratory conditions like COPD or asthma.'
        ],
        HighHeartRate: [
            `Abnormally low heart rate (bradycardia) may indicate a problem with the heart's electrical system.`
        ],
        HighTemperature: [
            'Low skin temperature may indicate poor circulation or exposure to cold conditions.'
        ],
        HighMood: [
            'Extreme mood swings may suggest bipolar disorder or emotional instability.'
        ],
        HighSleepTime: [
            'Excessive sleep may be a sign of certain medical conditions or poor sleep quality.'
        ],
        HighSportTime: [
            'Excessive or intense physical activity without proper recovery may lead to overtraining, injuries, and burnout.'
        ],
        LowMovement: [
            'Lack of movement may lead to stiffness, muscle atrophy, and decreased joint flexibility.'
        ],
        LowRespiration: [
            'Shallow breathing may lead to insufficient oxygen intake, causing fatigue and reduced cognitive function.'
        ],
        LowHydration: [
            'Dehydration can lead to dizziness, fatigue, headaches, and impaired cognitive function.'
        ],
        LowTemperature: [
            'Low body temperature may suggest hypothermia, which can lead to confusion, shivering, and, in severe cases, organ failure.'
        ],
        LowOxygenSaturation: [
            'Low oxygen saturation levels can indicate respiratory or cardiovascular problems, leading to shortness of breath and fatigue.'
        ],
        LowHeartRate: [
            `Abnormally low heart rate (bradycardia) may indicate a problem with the heart's electrical system.`
        ],
        LowTemperature: [
            'Low skin temperature may indicate poor circulation or exposure to cold conditions.'
        ],
        LowMood: [
            'Persistent low mood may indicate depression or other mental health concerns.'
        ],
        LowSleepTime: [
            'Insufficient sleep can lead to fatigue, impaired cognitive function, and increased susceptibility to illness.'
        ],
        LowSportTime: [
            'Inadequate physical activity may contribute to weight gain, muscle weakness, and poor cardiovascular health.'
        ]
    });

    useEffect(() => {
        if (corrcoeff == NaN || affectedCriteria == null || affectingCriteria == null || trendOfAbnormal == null) {
            return;
        }

        if (corrcoeff !== undefined) {
            const correlationSeverity = mapCorrelationSeverity(corrcoeff);
            const correlationDirection = corrcoeff > 0 ? 'positive' : 'negative';

            const trend = grammar.flatten(trendAnalysis(correlationDirection));
            const detect = grammar.flatten(severityAnalysis(correlationSeverity));
            const ad = grammar.flatten(selectAdvice(correlationDirection, trendOfAbnormal));
            const pos = grammar.flatten(detailedAdvice(affectedCriteria, trendOfAbnormal));

            if (trend) {
                setInfo(trend);
            }
            if (detect) {
                setDetectedValue(detect);
            }
            if (ad) {
                setChange(ad);
            }
            if (pos) {
                setPossibilities(pos);
            }

        } else {
            return 'No correlation information available for the specified attributes.';
        }

    }, [corrcoeff, affectingCriteria, affectedCriteria, trendOfAbnormal]);


    return (
        <Container>
            {info !== "" && (
                <div>
                    <HiInformationCircle />
                    {info}
                </div>
            )}

            {detectedValue !== "" && (
                <div>
                    <HiBell />
                    {detectedValue}
                </div>
            )}

            {change !== "" && (
                <div>
                    <HiOutlineKey />
                    {change}
                </div>
            )}

            {possibilities !== "" && (
                <div>
                    <HiExclamation />
                    {possibilities}
                </div>
            )}
        </Container>
    );

};

export {
    SuggestionComponent,
    findCorrelationsFromData
}
