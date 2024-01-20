import { useSession } from "@inrupt/solid-ui-react";
import { getSolidDataset, getFile } from "@inrupt/solid-client";
import { useEffect, useState } from "react";
import { checkHeartRateStatus, checkTemperatureStatus } from "./normalRanges";
import CorrelationMatrixComponent from "./matrix";
import GraphVisualizeComponent from "./graphVisualize";
const QueryEngine = require('@comunica/query-sparql').QueryEngine

const queryStr = `
                PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns>
                PREFIX xsd: <http://www.w3.org/2001/XMLSchema>
                PREFIX loinc: <https://loinc.org/rdf/>
                PREFIX owl: <http://www.w3.org/2002/07/owl>
                PREFIX fhir: <http://hl7.org/fhir/> 

                SELECT ?heartRateValue ?hrDate
                WHERE {
                    ?observation a fhir:Observation ;
                      fhir:id [ fhir:v "heart-rate"] ;
                      fhir:effective [ fhir:v ?hrDate] ;
                      fhir:value [ a fhir:Quantity ;
                        fhir:value [ fhir:v ?heartRateValue] ;
                        fhir:unit [ fhir:v "beats/minute" ] ;
                        fhir:system [ fhir:v "http://unitsofmeasure.org"^^xsd:anyURI ] ;
                        fhir:code [ fhir:v "/min" ]
                      ] .
                } `
const queryStr2 = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns>
                   PREFIX xsd: <http://www.w3.org/2001/XMLSchema>
                   PREFIX loinc: <https://loinc.org/rdf/>
                   PREFIX owl: <http://www.w3.org/2002/07/owl>
                   PREFIX fhir: <http://hl7.org/fhir/>
                   SELECT ?bodyTemp ?btDate
                   WHERE { 
                       ?observation a fhir:Observation ;
                         fhir:id [ fhir:v "body-temperature"] ;
                         fhir:effective [ fhir:v ?btDate] ;
                         fhir:value [
                            a fhir:Quantity ;
                            fhir:value [ fhir:v ?bodyTemp] ;
                            fhir:unit [ fhir:v "C" ] ;
                            fhir:system [ fhir:v "http://unitsofmeasure.org"^^xsd:anyURI ] ;
                            fhir:code [ fhir:v "Cel" ]
                         ] .
                    }`

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
        const hrDataset = await getSolidDataset("http://88.99.95.51:3000/Test2/", { fetch: session.fetch })
        // console.log("HR dataset",hrDataset) "https://lab.wirtz.tech/fhir/"
        const currentDate2 = new Date()
        console.log('Finish getting datasets:', currentDate2.toLocaleTimeString())
        console.log("All Files",hrDataset)
        setDataset(hrDataset)

        let sources = []
        for (const key in hrDataset.graphs.default) {
          if (hrDataset.graphs.default.hasOwnProperty(key)) { // change following url to match the new pattern     /^https:\/\/lab\.wirtz\.tech\/fhir\/
            // const pattern = /^https:\/\/88.99.95.51:3000\/Test2\/data_2023-12-18.*.ttl$/
            const pattern = /^http:\/\/88.99.95.51:3000\/Test2\/data_2024-01-16T16-.*.json$/
            // const pattern = /^https:\/\/lab.wirtz.tech\/fhir\/data_2023-12-18.*.ttl$/
            // const pattern = /^https:\/\/lab.wirtz.tech\/fhir\/data_2024-01-11T16-25-3.*.json$/
            const value = hrDataset.graphs.default[key]
            if (pattern.test(value.url)) {
              sources.push(value.url)
            }
          }
        }
        console.log("sources",sources)
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
        if(hrSources.length > 0){
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
              value: obj.measurement.heartrate,
              abnormal: checkHeartRateStatus(obj.measurement.heartrate),
              timestamp: new Date(obj.measurement.timestamp).toISOString().split('T')[0]
            }
            const bodyTemperatureObj = {
              value: obj.measurement.temperature,
              abnormal: checkHeartRateStatus(obj.measurement.temperature),
              timestamp: new Date(obj.measurement.timestamp).toISOString().split('T')[0]
            }
            hrArr.push(heartrateObj)
            tempArr.push(bodyTemperatureObj)
          })
        }
        hrArr.sort((a, b) => a.timestamp - b.timestamp)
        tempArr.sort((a, b) => a.timestamp - b.timestamp)
        console.log("heart rate object array", hrArr)
        console.log("body temp object array", tempArr)
        setBodyTempArr(tempArr)
        setHeartrateArr(hrArr)
        const temp = { "temperature": tempArr, "heart rate": hrArr }
        setQueriedDataset(temp)
        console.log(new Date(), "Done creating the data objects in heartRate.js");
        console.log(new Date(), temp);
      } catch (error) {
        console.log(error)
      }
    }
    queryObj()
  },[hrSources, session])

  /*useEffect(() => {
    const queryHeartRate = async () => {
      const myEngine = new QueryEngine()

      const bindingsStream = await myEngine.queryBindings(queryStr, {
        sources: hrSources
        //["https://lab.wirtz.tech/test/patient/patientInformation.ttl"] ? ? ? ?
      })
      const bindingsStream2 = await myEngine.queryBindings(queryStr2, {
        sources: hrSources
      })

      console.log("streams:",bindingsStream)

      if (bindingsStream && bindingsStream2) {

        console.log(new Date(), "Binding: ")

        const bindingsHr = await bindingsStream.toArray()
        const bindingsTemp = await bindingsStream2.toArray()
        console.log(new Date(), "BindingsStream Converted to Arr ")
        if (bindingsHr.length > 0 && bindingsTemp.length > 0) {
          const hrArr = []
          const tempArr = []
          bindingsHr.forEach(hrObj => {
            const heartrateObj = {
              value: parseFloat(hrObj.get('heartRateValue').value),
              abnormal: checkHeartRateStatus(hrObj.get('heartRateValue').value),
              timestamp: hrObj.get('hrDate').value
            }
            hrArr.push(heartrateObj)
          })
          bindingsTemp.forEach(btObj => {
            const bodyTemperatureObj = {
              value: parseFloat(btObj.get('bodyTemp').value),
              abnormal: checkTemperatureStatus(btObj.get('bodyTemp').value),
              timestamp: btObj.get('btDate').value
            }
            tempArr.push(bodyTemperatureObj)
          })
          hrArr.sort((a, b) => a.timestamp - b.timestamp)
          tempArr.sort((a, b) => a.timestamp - b.timestamp)
          //console.log("heart rate object array", hrArr)
          //console.log("body temp object array", tempArr)
          setBodyTempArr(tempArr)
          setHeartrateArr(hrArr)
          setQueriedDataset({ "temperature": tempArr, "heart rate": hrArr })
          console.log(new Date(), "Done creating the data objects in heartRate.js");
          console.log(new Date(), queriedDataset);
        }
      } else {
        console.log("No Data Available!")
      }
    }
    queryHeartRate()
  }, [hrSources])*/

  // Example: conditionally render different components based on the route
  const renderContent = () => {
    const currentPath = window.location.pathname

    switch (currentPath) {
      case '/pages/correlation':
        return <GraphVisualizeComponent criteriaData={queriedDataset} />;
      case '/pages/suggestions':
        return <CorrelationMatrixComponent criteriaData={queriedDataset} />;
      default:
        // Default content if the route doesn't match
        return <p>Invalid route</p>;
    }
  };

  return (
    
      <div>
      {
        queriedDataset ?
        renderContent()
        :
        <p>Loading</p>
      }
      </div>

  )
}

export default PodConnectionSuggestion