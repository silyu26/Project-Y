import { getSolidDataset, getThingAll } from "@inrupt/solid-client";
import { useSession } from "@inrupt/solid-ui-react";
import { useEffect, useState } from "react";
import { Container, Row, Col, Button} from "react-bootstrap";
const QueryEngine = require('@comunica/query-sparql').QueryEngine

const Profile = ()=> {

    const { session } = useSession()
    const [fname, setFName] = useState("")
    const [lname, setLName] = useState("")
    const [gender, setGender] = useState("")
    const [telecom, setTelecom] = useState("")
    const [birth, setBirth] = useState("")
    const [dataset, setDataset] = useState(null)


    
    const runQuery = async() => {
        const myEngine = new QueryEngine()
        // const parser = new Parser()
        // const endpointUrl = 'https://lab.wirtz.tech/test/patient/patientInformation.ttl'
        const queryStr = `
          PREFIX fhir: <http://hl7.org/fhir/> 
          PREFIX owl: <http://www.w3.org/2002/07/owl#> 
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
          PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

          SELECT ?fname ?lname ?gender ?tel ?birth
          WHERE {
            [ a fhir:Patient ;
              fhir:name ([ 
                fhir:family [ fhir:v ?lname ];
                fhir:given ([fhir:v ?fname])
              ]);
              fhir:gender [fhir:v ?gender];
              fhir:telecom ([ 
                fhir:value [ fhir:v ?tel ];
              ]);
              fhir:birthDate [fhir:v ?birth];
            ]
          } `
          const bindingsStream = await myEngine.queryBindings(queryStr, {
            sources: ['https://lab.wirtz.tech/test/patient/patientInformation.ttl'],
          })

        if(dataset) {
            // const result = RDFLib.Query(queryStr, dataset)
            // console.log("result:",result)
            const bindings = await bindingsStream.toArray()
            console.log(bindings[0].get('lname').value)
            console.log(bindings[0].get('fname').value)
            console.log(bindings[0].get('gender').value)
            console.log(bindings[0].get('tel').value)
            console.log(bindings[0].get('birth').value)
            setFName(bindings[0].get('fname').value)
            setLName(bindings[0].get('lname').value)
            setBirth(bindings[0].get('birth').value)
            setTelecom(bindings[0].get('tel').value)
            setGender(bindings[0].get('gender').value)
            /*
            bindingsStream.on('data', (binding) => {
                console.log(binding.toString()); // Quick way to print bindings for testing
            
                console.log(binding.has('s')); // Will be true
            
                // Obtaining values
                // console.log(binding.get('s').value);
                // console.log(binding.get('s').termType);
                // console.log(binding.get('p').value);
                // console.log(binding.get('o').value);
            });
            bindingsStream.on('end', () => {
                // The data-listener will not be called anymore once we get here.
            });
            bindingsStream.on('error', (error) => {
                console.error(error);
            });*/
        } else {
            console.log("No Dataset Loaded")
        }
        
    }

    useEffect(() => {
        const getPatientProfile = async() => {
            try {
                const profileDataset = await getSolidDataset("https://lab.wirtz.tech/test/patient/patientInformation.ttl", {fetch: session.fetch})
                console.log("profile dataset",profileDataset)
                setDataset(profileDataset)
                const patientThings = profileDataset ? getThingAll(profileDataset) : [];
                console.log("patientThings",patientThings)
            } catch (error) {
                console.log("error!",error)
            }
        }
        getPatientProfile()
    },[session])

    return (
        <Container>
            {/**/}
            <Button variant="info" onClick={runQuery}>Run Query</Button>
            <Row>
              <Col>First Name: {fname}</Col>
              <Col>Last Name: {lname}</Col>
              <Col>Gender: {gender}</Col>
              <Col>Tel: {telecom}</Col>
              <Col>Birthday: {birth}</Col>
            </Row>
        </Container>
    )
}

export default Profile