import { LoginButton, LogoutButton, Text, useSession, CombinedDataProvider } from "@inrupt/solid-ui-react"
// import { createSolidDataset, getSolidDataset, saveSolidDatasetAt } from "@inrupt/solid-client"
import { useState } from "react"
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css'
import GetOrCreatePatient from "./components/testPatient"
import Test from "./components/test"

const authOptions = {
  clientName: "Solid Project Y",
}

function App() {
  
  const {session} = useSession()
  const [error, setError] = useState(null) 
  const [showToast, setShowToast] = useState(false)

  const onError = (Error) => {
    console.log("Error:",Error)
    // const statusCode = parseInt(Error.message.split(' ')[2])
    setError(Error.message)
    setShowToast(true)
  }  

  return (
    <div className="App">
      {session.info.isLoggedIn ? (
        <CombinedDataProvider datasetUrl={session.info.webId}
          thingUrl={session.info.webId} >
          <div className="message logged-in">
            <span>You are logged in as: </span>
            <Text properties={[
              "http://www.w3.org/2006/vcard/ns#fn",
              "http://xmlns.com/foaf/0.1/",]} />
            <LogoutButton >
              <Button variant="outline-warning">Log Out</Button>
            </LogoutButton>
          </div>
          <section>
            <GetOrCreatePatient />
            <Test />
          </section>
        </CombinedDataProvider>
      ) : (
        <div className="message">
          <span>You are not logged in. </span>
          <LoginButton className="authButton"
            oidcIssuer="https://lab.wirtz.tech/"
            // oidcIssuer="https://inrupt.net/"
            redirectUrl={window.location.href}
            authOptions={authOptions}
            onError={onError}
          >
            <Button variant="outline-primary">Log In</Button>
          </LoginButton> 
        </div>
      )}

      <ToastContainer position="top-end">
      <Toast bg="danger" show={showToast} onClose={() => setShowToast(false)} delay={5000} autohide>
        <Toast.Header>
          <strong className="mr-auto">Error</strong>
        </Toast.Header>
        <Toast.Body>{error}</Toast.Body>
      </Toast></ToastContainer>
    </div>
  );
}

export default App;
