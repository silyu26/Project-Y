import { LoginButton, LogoutButton, useSession, CombinedDataProvider } from "@inrupt/solid-ui-react"
// import { createSolidDataset, getSolidDataset, saveSolidDatasetAt } from "@inrupt/solid-client"
import { useState } from "react"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'


const authOptions = {
    clientName: "Solid Project Y",
  }

function Loginnavbar() {
  const {session} = useSession()
  const [error, setError] = useState(null) 
  const [showToast, setShowToast] = useState(false)

    const onError = (Error) => {
        console.log("Error:",Error)
        // const statusCode = parseInt(Error.message.split(' ')[2])storedItem
        setError(Error.message)
        setShowToast(true)
    } 

    return(
      <>
      <Container>
        <Row>
          <Col className="text-center">
            {session.info.isLoggedIn ? (
            <CombinedDataProvider datasetUrl={session.info.webId} thingUrl={session.info.webId} >
              <Row className="text-center">
                <div className="message logged-in">
                  <LogoutButton >
                    <Button variant="outline-warning">Log Out</Button>
                  </LogoutButton>
                </div>
              </Row>
            </CombinedDataProvider>
        ) : <Row>
            <div className="message">
              <LoginButton className="authButton" oidcIssuer={process.env.REACT_APP_SERVER_URL} //"https://lab.wirtz.tech/""https://solidweb.me/"
                redirectUrl={"http://localhost:3000/"}
                authOptions={authOptions}
                onError={onError} >
                <Button variant="outline-primary">Log In</Button>
              </LoginButton> 
            </div>
           </Row>}
          </Col>
        </Row>
      </Container>

      <ToastContainer position="top-end">
        <Toast bg="danger" show={showToast} onClose={() => setShowToast(false)} delay={5000} autohide>
          <Toast.Header>
            <strong className="mr-auto">Error</strong>
          </Toast.Header>
          <Toast.Body>{error}</Toast.Body>
        </Toast>
      </ToastContainer>
      </>
    )
}
 export default Loginnavbar