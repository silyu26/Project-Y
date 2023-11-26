import { createSolidDataset, getSolidDataset, saveSolidDatasetAt, getUrlAll, getThing, getPodUrlAll,
  addDatetime, addStringNoLocale, createThing, setThing, getSourceUrl, addUrl } from "@inrupt/solid-client"
import { useSession } from "@inrupt/solid-ui-react"
import { useEffect, useState } from "react"
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'

const STORAGE_PREDICATE = "http://www.w3.org/ns/pim/space#storage";
const TEXT_PREDICATE = "http://schema.org/text";
const CREATED_PREDICATE = "http://www.w3.org/2002/12/cal/ical#created";
const TODO_CLASS = "http://www.w3.org/2002/12/cal/ical#Vtodo";
const TYPE_PREDICATE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";

function GetOrCreatePatient() {
    const { session } = useSession()
    const [patient, setPatient] = useState()
    const [Text, setText] = useState("");


    const getOrCreatePatient = async (containerUri, fetch) => {
        const indexUrl = `${containerUri}index.ttl`
        try{
          const patient = await getSolidDataset(indexUrl, {fetch})
          return patient
        } catch (error) {
          if(error.statusCode === 404) {
            const patient = await saveSolidDatasetAt(
              indexUrl,
              createSolidDataset(), {
                fetch
              }
            )
            return patient
          }
        }
    }

    const addPatient = async (text) => {
        const indexUrl = getSourceUrl(patient);
        const todoWithText = addStringNoLocale(createThing(), TEXT_PREDICATE, text);
        const todoWithDate = addDatetime(
          todoWithText,
          CREATED_PREDICATE,
          new Date()
        );
        const todoWithType = addUrl(todoWithDate, TODO_CLASS, TYPE_PREDICATE);
        const updatedTodoList = setThing(patient, todoWithType);
        const updatedDataset = await saveSolidDatasetAt(indexUrl, updatedTodoList, {
          fetch: session.fetch,
        });
        setPatient(updatedDataset);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        addPatient(Text);
        setText("")
    }
    
    const handleChange = (e) => {
        e.preventDefault();
        setText(e.target.value);
    }

    useEffect(() => {
      if (!session) return;
      (async () => {
        const profileDataset = await getSolidDataset(session.info.webId, {
          fetch: session.fetch,
        })
        console.log("profile dataset:",profileDataset)
        const profileThing = getThing(profileDataset, session.info.webId)
        console.log("profile thing:",profileThing)
        {/*const podsUrls = getUrlAll(
          profileThing,
          "http://www.w3.org/ns/pim/space#storage"
        )*/}
        const mypods = await getPodUrlAll('https://lab.wirtz.tech/test/profile/card#me' , { fetch })
        console.log("mypods:",mypods)
        // const pod = podsUrls[0]
        // const pod = 'https://lab.wirtz.tech/test/'
        // console.log("podUrl:",podsUrls)
        // const containerUri = `${pod}patient/`
        const containerUri = 'https://lab.wirtz.tech/test/patient/'
        const patient = await getOrCreatePatient(containerUri, session.fetch)
        console.log("patient:",patient)
        setPatient(patient)
        // console.log("patient:",patient)
      })()
    }, [session])

    return(
      <Container>
        <Row>
        <Form onSubmit={handleSubmit}>
          <Form.Group className='mb-3' controlId='title'>
            <Form.Label>patient input</Form.Label>
            <Form.Control type="text" placeholder="Plan Title" required
                value={Text} onChange={(e) => setText(e.target.value)} />
          </Form.Group>
          
          <Button type="submit" variant="info" size="sm">
            Add Patient
          </Button>
        </Form>
        </Row>
      </Container>
    )
}

export default GetOrCreatePatient