import { useSession } from "@inrupt/solid-ui-react";
import { getSolidDataset, getFile } from "@inrupt/solid-client";
import { useEffect, useState } from "react";
import { checkHeartRateStatus, checkTemperatureStatus, checkHydrationStatus } from "../../utils/normalRanges";
import CorrelationMatrixComponent from "./matrix";
import GraphVisualizeComponent from "./graphVisualize";
import { Container, Row } from "react-bootstrap";
import { Status } from "../../utils/normalRanges";
import Goals from "../../pages/goals";
import { parseNumberFromString } from "../../utils/parser";

const PodConnectionSuggestion = () => {

  const { session } = useSession()
  const [hrSources, setHrSources] = useState([])
  const [dataset, setDataset] = useState(null)
  const [heartrateArr, setHeartrateArr] = useState(null)
  const [bodyTempArr, setBodyTempArr] = useState(null)
  const [queriedDataset, setQueriedDataset] = useState(null)


  useEffect(() => {
    const getHeartrateSources = async () => {
      try {  //  change following url to the pod container of heartrate and body temperature  fhir/
        const currentDate1 = new Date()
        console.log('Starting getting datasets:', currentDate1.toLocaleTimeString())
        const hrDataset = await getSolidDataset(process.env.REACT_APP_FHIR_DATA_URL+"2024-1-22/", { fetch: session.fetch })
        //console.log("HR dataset",hrDataset) 
        const currentDate2 = new Date()
        console.log('Finish getting datasets:', currentDate2.toLocaleTimeString())
        console.log("All Files", hrDataset)
        setDataset(hrDataset)

        let sources = []
        for (const key in hrDataset.graphs.default) {
          if (hrDataset.graphs.default.hasOwnProperty(key)) { // change following url to match the new pattern     /^https:\/\/lab\.wirtz\.tech\/fhir\/
            // const pattern = /^https:\/\/88.99.95.51:3000\/Test2\/data_2023-12-18.*.ttl$/
            const pattern = /^http:\/\/88.99.95.51:4000\/temporal_pod\/2024-1-22\/data_2024-01-22T.*.json$/
            // const pattern = /^https:\/\/lab.wirtz.tech\/fhir\/data_2023-12-18.*.ttl$/
            // const pattern = /^https:\/\/lab.wirtz.tech\/fhir\/data_2024-01-11T16-25-3.*.json$/
            const value = hrDataset.graphs.default[key]
            if (pattern.test(value.url)) {
              sources.push(value.url)
            }
          }
        }
        console.log("sources", sources)
        setHrSources(sources)
      } catch (error) {
        console.log("error!", error)
      }
    }
    getHeartrateSources()
  }, [session])

  useEffect(() => {
    const queryObj = async () => {
      try {
        let hrArr = []
        let tempArr = []
        let hydArr = []
        let activeArr = []
        if (hrSources.length > 0) {
          const currentDate3 = new Date()
          console.log('Start getting obj:', currentDate3.toLocaleTimeString())
          /*hrSources.forEach(async source => {
            const file = await getFile(
              source,        
              { fetch: session.fetch }   
            )
            const obj = JSON.parse(await file.text())
            objArr.push(obj)
          })*/
          const promises = hrSources.map(async (source) => {
            const file = await getFile(source, { fetch: session.fetch })
            return JSON.parse(await file.text())
          })
          const objArr = await Promise.all(promises)
          // console.log("res:",objArr)
          // console.log("1",objArr.length)
          // console.log("2",objArr[0].measurement.heartrate)
          const currentDate4 = new Date()
          console.log('Finish getting obj:', currentDate4.toLocaleTimeString())

          objArr.forEach(obj => {
            const heartrateObj = {
              value: parseNumberFromString(obj.measurement.heartrate),
              abnormal: checkHeartRateStatus(obj.measurement.heartrate),
              timestamp: new Date(obj.measurement.timestamp).toISOString().split('T')[0]
            }
            const bodyTemperatureObj = {
              value: parseNumberFromString(obj.measurement.temperature),
              abnormal: checkTemperatureStatus(obj.measurement.temperature),
              timestamp: new Date(obj.measurement.timestamp).toISOString().split('T')[0]
            }
            const hydrationObj = {
              value: parseNumberFromString(obj.measurement.humidity),
              abnormal: checkHydrationStatus(obj.measurement.temperature),
              timestamp: new Date(obj.measurement.timestamp).toISOString().split('T')[0]
            }
            const sportObj = {
              value: parseNumberFromString(obj.measurement.doingsport),
              abnormal: Status.NORMAL,
              timestamp: new Date(obj.measurement.timestamp).toISOString().split('T')[0]
            }
            hrArr.push(heartrateObj)
            tempArr.push(bodyTemperatureObj)
            hydArr.push(hydrationObj)
            activeArr.push(sportObj)
          })
        }
        hrArr.sort((a, b) => a.timestamp - b.timestamp)
        tempArr.sort((a, b) => a.timestamp - b.timestamp)
        hydArr.sort((a, b) => a.timestamp - b.timestamp)
        activeArr.sort((a, b) => a.timestamp - b.timestamp)


        console.log("heart rate object array", hrArr)
        console.log("body temp object array", tempArr)
        setBodyTempArr(tempArr)
        setHeartrateArr(hrArr)
        const temp = { "temperature": tempArr, "heart rate": hrArr, "hydration": hydArr, "sport": activeArr }
        setQueriedDataset(temp)
        console.log(new Date(), "Done creating the data objects in heartRate.js");
        console.log(new Date(), temp);
      } catch (error) {
        console.log(error)
      }
    }
    queryObj()
  }, [hrSources, session])

  // Example: conditionally render different components based on the route
  const renderContent = () => {
    const currentPath = window.location.pathname

    switch (currentPath) {
      case '/pages/correlation':
        return <GraphVisualizeComponent criteriaData={queriedDataset} />;
      case '/pages/suggestions':
        return <CorrelationMatrixComponent criteriaData={queriedDataset} />;
      case '/pages/goals':
        return <Goals criteriaData={queriedDataset} />
      default:
        // Default content if the route doesn't match
        return <p>Invalid route</p>;
    }
  };

  return (
    
      <Container>
      {
        queriedDataset ?
          renderContent()
          :
          <p>Loading</p>
      }
      </Container>

  )
}

export default PodConnectionSuggestion