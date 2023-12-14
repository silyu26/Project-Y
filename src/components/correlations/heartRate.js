import { useSession } from "@inrupt/solid-ui-react";
import { getSolidDataset } from "@inrupt/solid-client";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
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

const HeartrateCor = () => {

    const { session } = useSession()
    const [hrSources, setHrSources] = useState([])
    const [dataset, setDataset] = useState(null)
    const [heartrateArr, setHeartrateArr] = useState([])
    const [bodyTempArr, setBodyTempArr] = useState([])

    useEffect(() => {
        const getHeartrateSources = async() => {
            try {  //  change following url to the pod container of heartrate and body temperature  fhir/
                const hrDataset = await getSolidDataset("https://lab.wirtz.tech/test/patient/", {fetch: session.fetch})
                // console.log("HR dataset",hrDataset.graphs.default)
                setDataset(hrDataset)

                let sources = []
                for (const key in hrDataset.graphs.default) {
                  if(hrDataset.graphs.default.hasOwnProperty(key)) { // change following url to match the new pattern     /^https:\/\/lab\.wirtz\.tech\/fhir\/
                    const pattern = /^https:\/\/lab\.wirtz\.tech\/test\/patient\/observation_test.*\.ttl$/
                    const value = hrDataset.graphs.default[key]
                    if(pattern.test(value.url)){
                      sources.push(value.url)
                    }
                  }
                }
                // console.log("sources",sources)
                setHrSources(sources)
            } catch (error) {
                console.log("error!",error)
            }
        }
        getHeartrateSources()
    },[session])

    useEffect(() => {
        const queryHeartRate = async() => {
          const myEngine = new QueryEngine()

          const bindingsStream = await myEngine.queryBindings(queryStr, {
            sources: hrSources
              //["https://lab.wirtz.tech/test/patient/patientInformation.ttl"] ? ? ? ?
          })
          const bindingsStream2 = await myEngine.queryBindings(queryStr2,{
            sources: hrSources
          })
  
          if(bindingsStream && bindingsStream2) {
            
            const bindingsHr = await bindingsStream.toArray()
            const bindingsTemp = await bindingsStream2.toArray()
            if(bindingsHr.length > 0 && bindingsTemp.length > 0){
                const tempArr = []
                const tempArr2 = []
                bindingsHr.forEach(hrObj => {
                    const heartrateObj = {
                      heartrate: hrObj.get('heartRateValue').value,
                      timestamp: hrObj.get('hrDate').value
                    }
                    tempArr.push(heartrateObj)
                })
                bindingsTemp.forEach(btObj => {
                    const bodyTemperatureObj = {
                        body_Temperature: btObj.get('bodyTemp').value,
                        timestamp: btObj.get('btDate').value
                      }
                    tempArr2.push(bodyTemperatureObj)
                })
                tempArr.sort((a, b) => a.timestamp - b.timestamp)
                tempArr2.sort((a, b) => a.timestamp - b.timestamp)
                console.log("heart rate object array",tempArr)
                console.log("body temp object array",tempArr2)
                setBodyTempArr(tempArr2)
                setHeartrateArr(tempArr)
              }
          } else {
              console.log("No Data Available!")
          } 
        }
        queryHeartRate()
      },[hrSources])

      return(
        <Container>
        </Container>
      )
}

export default HeartrateCor