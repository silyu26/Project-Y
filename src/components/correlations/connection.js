import { useSession } from "@inrupt/solid-ui-react";
import { getSolidDataset, getFile, isContainer } from "@inrupt/solid-client";
import { useEffect, useState } from "react";
import { checkStatus } from "../../utils/normalRanges";
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
  const [queriedDataset, setQueriedDataset] = useState(null)
  const [containers, setContainers] = useState([])
  const [validContainer, setValidContainer] = useState([])
  const [isSharing, setIsSharing] = useState(true)
  const [urls, setUrls] = useState([])
  const [urls2, setUrls2] = useState([])
  const [show, setShow] = useState(false)
  const [show2, setShow2] = useState(false)

  useEffect(() => {
    const getAllContainers = async () => {
      try {
        const hrDataset = await getSolidDataset(process.env.REACT_APP_FHIR_DATA_URL, { fetch: session.fetch })
        console.log(hrDataset)
        let tmp = []
        for (const key in hrDataset.graphs.default) {
          if (isContainer(key) && key !== process.env.REACT_APP_FHIR_DATA_URL) {
            const tmpUrl = key.replace(process.env.REACT_APP_FHIR_DATA_URL, "")
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


  const getObjFromUrl = async (url) => {

    let sources = []
    let datasets = await getSolidDataset(url, { fetch: session.fetch });

    for (const key in datasets.graphs.default) {
      const value = datasets.graphs.default[key]
      if (!isContainer(value.url)) {
        sources.push(value.url)
      }
    }
    const promises = sources.map(async (source) => {
      const file = await getFile(source, { fetch: session.fetch })
      return JSON.parse(await file.text())
    })
    const objArr = await Promise.all(promises);
    return objArr;
  };

  const getManualObjFromUrl = async (url) => {
    let datasets = await getSolidDataset(url, { fetch: session.fetch });
    if (datasets.graphs.default.hasOwnProperty(`${url}manual/`)) {
      return getObjFromUrl(`${url}manual/`)
    }
    else {
      return null;
    }
  };

  const createObj = (type, value, timestamp) => {
    return {
      value: parseNumberFromString(value),
      abnormal: checkStatus(type, value),
      timestamp: timestamp
    };
  };

  //filter manual data with automatic data from emotibits (sport)
  const handleSpecialCases = (temp, hrArr, activeArr) => {
    if (temp["sport level"] && temp["sport level"].length === hrArr.length) {
      activeArr.forEach((obj, index) => {
        if (obj.value !== 1) {
          temp["sport level"][index].value = 0;
        }
      });
    }

    if (temp["sport time"] && temp["sport time"].length === hrArr.length) {
      activeArr.forEach((obj, index) => {
        if (obj.value !== 1) {
          temp["sport time"][index].value = 0;
        }
      });
    }
  };

  useEffect(() => {
    const queryObj = async () => {
      try {
        const [hrArr, tempArr, hydArr, activeArr, sportLevelArr, sportTimeArr, moodArr, sleepArr] = Array.from({ length: 8 }, () => []);

        for (const url of urls) {
          const contObjArr = await getObjFromUrl(url);
          const manualObjArr = await getManualObjFromUrl(url);
          let moodMorningObj;
          let moodEveningObj;
          let sportLevelObj;
          let sportTimeObj;
          let sleepObj;

          if (manualObjArr && manualObjArr.length > 0) {
            manualObjArr.forEach(manualObj => {
              switch (manualObj.id) {
                case "Mood Morning":
                  moodMorningObj = createObj("mood", manualObj.value, "");
                  break;
                case "Mood Evening":
                  moodEveningObj = createObj("mood", manualObj.value, "");
                  break;
                case "Sports level of effort":
                  sportLevelObj = createObj("sportLevel", manualObj.value, "");
                  break;
                case "Sports activity time":
                  sportTimeObj = createObj("sportTime", manualObj.value, "");
                  break;
                case "Sleep length":
                  sleepObj = createObj("sleep", manualObj.value, "");
                  break;
              }
            });
          }

          //mock or sample manual data object if needed
          [{ obj: sportLevelObj, arr: sportLevelArr },
          { obj: sportTimeObj, arr: sportTimeArr },
          { obj: moodMorningObj, arr: moodArr },
          { obj: moodEveningObj, arr: moodArr },
          { obj: sleepObj, arr: sleepArr }].forEach(item => {
            if (item.obj == undefined || item.obj == null || item.obj) {
              const mockObj = item.arr > 0 ? { value: item.arr.slice(-1).value, abnormal: Status.UNDEF, timestamp: "" }
                : { value: 0, abnormal: Status.UNDEF, timestamp: "" };
              item.obj = mockObj;
            }
          });


          contObjArr.forEach(obj => {
            const time = new Date(obj.measurement.timestamp);
            const timeString = time.getTime();

            hrArr.push(createObj("heartRate", obj.measurement.heartrate, timeString));
            tempArr.push(createObj("temperatureCelsius", obj.measurement.temperature, timeString));
            hydArr.push(createObj("hydration", obj.measurement.humidity, timeString));
            activeArr.push(createObj("doingsport", obj.measurement.doingsport, timeString));

            [{ obj: sportLevelObj, arr: sportLevelArr },
            { obj: sportTimeObj, arr: sportTimeArr },
            { obj: time.getHours() >= 12 ? moodEveningObj : moodMorningObj, arr: moodArr },
            { obj: sleepObj, arr: sleepArr }].forEach(item => {
              item.obj.timestamp = timeString;
              item.arr.push(item.obj);
            });

          });
        }

        [hrArr, tempArr, hydArr, activeArr, sportLevelArr, sportTimeArr, moodArr, sleepArr].forEach(arr => arr.sort((a, b) => a.timestamp - b.timestamp));

        const temp = {
          "temperature": tempArr,
          "heart rate": hrArr,
          "hydration": hydArr,
          "sport level": sportLevelArr,
          "sport time": sportTimeArr,
          "mood": moodArr,
          "sleep": sleepArr
        };

        handleSpecialCases(temp, hrArr, activeArr);
        setQueriedDataset(temp);

        console.log(new Date(), "Done creating the data objects in heartRate.js");
        console.log(new Date(), temp);
      } catch (error) {
        console.log(error);
      }
    };

    queryObj();
  }, [urls, session]);


  const shareData = () => {
    try {
      let urls = []
      let urls2 = []
      if (validContainer.length > 0) {
        console.log(validContainer)
        for (const container of validContainer) {
          urls.push(process.env.REACT_APP_FHIR_DATA_URL + container.value)
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
    if (queriedDataset) {
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
      <Button variant='outline-primary' onClick={() => setIsSharing(!isSharing)}>Select Data</Button>

      <Modal show={isSharing} onHide={() => setIsSharing(!isSharing)} size="lg">
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
          <br />
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