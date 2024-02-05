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
    if (absCor > 0 && absCor < 0.2) return 'very weak';
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
            case 'sleep':
                return '#HighSleep#';
            case 'sport time':
                return '#HighSportTime#';
            case 'sport level':
                return '#HighSportLevel#';
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
            case 'sleep':
                return '#LowSleep#';
            case 'sport time':
                return '#LowSportTime#';
            case 'sport level':
                return '#LowSportLevel#';
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

            if (correlationCoefficient === undefined || correlationCoefficient === null || correlationCoefficient==0 || isNaN(correlationCoefficient)) {
                return;
            }

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
        AffectingCriteria: ['hydration', 'body temperature', 'heart rate', 'temperature', 'mood', 'sleep', 'sport time', 'sport level'],
        AffectedCriteria: ['hydration', 'body temperature', 'heart rate', 'temperature', 'mood', 'sleep', 'sport time', 'sport level'],
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
            'An unusually high body temperature has been recorded. An elevated body temperature could be a sign of hyperthermia, potentially resulting in symptoms like confusion, increased sweating, and, in severe instances, the risk of organ failure.'
        ],
        HighOxygenSaturation: [
            'Monitoring oxygen saturation is crucial for individuals with respiratory conditions like COPD or asthma.'
        ],
        HighHeartRate: [
            `Elevated heart rate levels have been detected. Abnormally low heart rate (bradycardia) may indicate a problem with the heart's electrical system.`
        ],
        HighMood: [
            'Abnormally high mood levels have been identified. Extreme mood swings may suggest bipolar disorder or emotional instability.'
        ],
        HighSleep: [
            ' Abnormally extended sleep duration or disrupted sleep patterns have been observed. Excessive sleep may be a sign of certain medical conditions or poor sleep quality.'
        ],
        HighSportTime: [
            'There are indications of an unusually prolonged duration of sports activity. Excessive or intense physical activity without proper recovery may lead to overtraining, injuries, and burnout.',
            'There are indications of an unusually prolonged duration of sports activity. Exceesive physical activity has the potential for a negative impact on social and work-life balance.',
            'There are indications of an unusually prolonged duration of sports activity. Elevated stress levels and decreased immune function can be associated with excessive sport time.'
        ],
        HighSportLevel: [
            'We noticed a higher-than-normal intensity in sports activity. Overtraining can make you feel persistently tired and lead to a decline in performance, even when you are putting in more effort.',
            'We noticed a higher-than-normal intensity in sports activity. Pushing your body too hard in sports increases the risk of getting hurt, from strains to long-lasting injuries due to repetitive stress.',
            'We noticed a higher-than-normal intensity in sports activity. Overdoing it in sports may bring about stress, irritability, mood swings, and make it harder to find motivation for physical activities.',
            'We noticed a higher-than-normal intensity in sports activity. Excessive training might disrupt your sleep, making it challenging to fall asleep or stay asleep, and leaving you feeling less rested.',
            'We noticed a higher-than-normal intensity in sports activity. Training too intensely can mess with your hormones, potentially causing irregular menstrual cycles in females and other hormonal imbalances.',
            'We noticed a higher-than-normal intensity in sports activity. Overtraining weakens your immune system, making you more susceptible to illnesses and lengthening the time it takes to recover.',
            'We noticed a higher-than-normal intensity in sports activity. Going beyond your limits may lead to not getting enough essential nutrients, affecting your overall health.',
            'We noticed a higher-than-normal intensity in sports activity. Balancing social life and training can be challenging, potentially straining relationships and causing neglect of other important life responsibilities.',
            'We noticed a higher-than-normal intensity in sports activity. Constant fatigue from overtraining might result in a plateau or decline in your athletic performance and physical abilities.'
        ],
        LowMovement: [
            'Lack of movement may lead to stiffness, muscle atrophy, and decreased joint flexibility.'
        ],
        LowRespiration: [
            'Shallow breathing may lead to insufficient oxygen intake, causing fatigue and reduced cognitive function.'
        ],
        LowHydration: [
            'We have identified unusually low hydration levels. Dehydration can lead to dizziness, fatigue, headaches, and impaired cognitive function.'
        ],
        LowTemperature: [
            'We observed an abnormally low body temperature. Low body temperature may suggest hypothermia, which can lead to confusion, shivering, and, in severe cases, organ failure.'
        ],
        LowOxygenSaturation: [
            'Low oxygen saturation levels can indicate respiratory or cardiovascular problems, leading to shortness of breath and fatigue.'
        ],
        LowHeartRate: [
            `An unusually low heart rate has been detected. Abnormally low heart rate (bradycardia) may indicate a problem with the heart's electrical system.`
        ],
        LowTemperature: [
            'Low skin temperature may indicate poor circulation or exposure to cold conditions.'
        ],
        LowMood: [
            'Abnormally low mood levels have been identified. Persistent low mood may indicate depression or other mental health concerns.'
        ],
        LowSleep: [
            'Abnormally low sleep duration or quality has been observed. Insufficient sleep can lead to fatigue, impaired cognitive function, and increased susceptibility to illness.'
        ],
        LowSportTime: [
            'There are indications of an unusually short duration of sports activity. Inadequate physical activity may contribute to weight gain, muscle weakness, and poor cardiovascular health.',
            'There are indications of an unusually short duration of sports activity. Insufficient sport time may result in reduced cardiovascular fitness and endurance.',
            'There are indications of an unusually short duration of sports activity. Inadequate can increase the risk of weight gain and obesity.',
            'There are indications of an unusually short duration of sports activity. Insufficient sport time may lead to lowered mood and increased stress levels.'
        ],
        LowSportLevel: [
            'We noticed a lower-than-normal intensity in sports activity. Light activity may not burn enough calories, potentially hindering weight management efforts.',
            'We noticed a lower-than-normal intensity in sports activity. Progress in improving overall fitness levels may be slower without adequate sport intensity.',
            'We noticed a lower-than-normal intensity in sports activity. The body may not be effectively challenged with low level of sport, reducing the potential for optimal health benefits.',
            'We noticed a lower-than-normal intensity in sports activity. Light activity may not provide enough stimulation to positively impact mood and mental well-being.'
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
