import { useSession } from "@inrupt/solid-ui-react";
import { getSolidDataset, getFile, isContainer } from "@inrupt/solid-client";
import { useEffect, useState } from "react";
import { checkHeartRateStatus, checkTemperatureStatus, checkHydrationStatus } from "../../utils/normalRanges";
import CorrelationMatrixComponent from "./matrix";
import GraphVisualizeComponent from "./graphVisualize";
import { Container, Row, Col, Button, Modal, Toast, ToastContainer } from "react-bootstrap";
import { Status } from "../../utils/normalRanges";
import Goals from "../../pages/goals";
import { parseNumberFromString } from "../../utils/parser";
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import { FaRegFaceSmileWink } from "react-icons/fa6";

const animatedComponents = makeAnimated()

const PodConnectionSuggestion = () => {

  const { session } = useSession()
  const [hrSources, setHrSources] = useState([])
  const [dataset, setDataset] = useState(null)
  const [heartrateArr, setHeartrateArr] = useState(null)
  const [bodyTempArr, setBodyTempArr] = useState(null)
  const [queriedDataset, setQueriedDataset] = useState(null)
  const [containers, setContainers] = useState([])
  const [validContainer, setValidContainer] = useState([])
  const [isSharing, setIsSharing] = useState(false)
  const [urls, setUrls] = useState([])
  const [urls2, setUrls2] = useState([])
  const [show, setShow] = useState(false)
  const [show2, setShow2] = useState(false)

  useEffect(() => {
    const getAllContainers = async() => {
      try {
        const hrDataset = await getSolidDataset(process.env.REACT_APP_FHIR_DATA_URL, { fetch: session.fetch })
        console.log(hrDataset)
        let tmp = []
        for (const key in hrDataset.graphs.default) {
          if(isContainer(key) && key!==process.env.REACT_APP_FHIR_DATA_URL ) {
            const tmpUrl= key.replace(process.env.REACT_APP_FHIR_DATA_URL,"")
            tmp.push({ value: tmpUrl, label: tmpUrl })
          }
        }
        setContainers(tmp)
        console.log(tmp)

      } catch (error) {
        console.log(error)
      }
    }
    getAllContainers()
  }, [])

  /*
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
  }, [session]) */

  useEffect(() => {
    const queryObj = async () => {
      try {
        let hrArr = []
        let tempArr = []
        let hydArr = []
        let activeArr = []
        if (urls.length > 0) {
          for(const url of urls){
            let sources = []
            const datasets = await getSolidDataset(url, { fetch: session.fetch })
            for(const key in datasets.graphs.default){
              const value = datasets.graphs.default[key]
              if(!isContainer(value.url)){
                sources.push(value.url)
              }
            }
            const promises = sources.map(async (source) => {
              const file = await getFile(source, { fetch: session.fetch })
              return JSON.parse(await file.text())
            })
            const objArr = await Promise.all(promises)
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
        console.log(new Date(), temp)
      } catch (error) {
        console.log(error)
      }
    }
    queryObj()
  }, [urls, session])

  const shareData = () => {
    try {
      let urls = []
      let urls2 = []
      if(validContainer.length > 0){
        console.log(validContainer)
        for(const container of validContainer){
          urls.push(process.env.REACT_APP_FHIR_DATA_URL+container.value)
          urls2.push({ value: container.value, label: container.value })
        }
        console.log(urls)
        setUrls(urls)
        setUrls2(urls2)
        setIsSharing(!isSharing)
      }
      setShow(true)
    } catch (error) {
      console.log(error)
      setShow2(true)
    }
    
    
  }

  // Example: conditionally render different components based on the route
  const renderContent = () => {
    const currentPath = window.location.pathname
    if(queriedDataset) {
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
      <br />
      <Button variant='outline-primary' onClick={()=>setIsSharing(!isSharing)}>Select Data</Button>

      <Modal show={isSharing} onHide={()=>setIsSharing(!isSharing)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Data Selection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <p className='text-center' style={{ fontStyle: 'italic' }}>Simply select the data you want and we'll analyze them for you! <FaRegFaceSmileWink /></p>
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            defaultValue={urls2}
            isMulti
            options={containers}
            onChange={setValidContainer}
          />
          <br/>
          <Button variant='outline-primary' onClick={shareData}>Start</Button>
        </Modal.Body>
      </Modal>

      <ToastContainer position='top-end'>
      <Toast show={show} onClose={() => setShow(false)} delay={5000} bg='success'>
        <Toast.Header>
          <strong className="me-auto">Analyzation Completed!</strong>
          
        </Toast.Header>
        <Toast.Body>You can now view your correlation, suggestion and goals!</Toast.Body>
      </Toast>
      <Toast show={show2} onClose={() => setShow2(false)} delay={5000} bg='danger' >
        <Toast.Header>
          <strong className="me-auto">Analyzation Failed!</strong>
          
        </Toast.Header>
        <Toast.Body>Something is not working...</Toast.Body>
      </Toast></ToastContainer>

      </Container>

  )
}

export default PodConnectionSuggestion