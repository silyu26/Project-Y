import { LoginButton, LogoutButton, Text, useSession, CombinedDataProvider } from "@inrupt/solid-ui-react"
// import Button from 'react-bootstrap/Button'

const authOptions = {
  clientName: "Solid Project Y",
}

function App() {
  
  const {session} = useSession()

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
            <LogoutButton />
          </div>
        </CombinedDataProvider>
      ) : (
        <div className="message">
          <span>You are not logged in. </span>
          <LoginButton className="authButton"
            oidcIssuer="https://lab.wirtz.tech/"
            redirectUrl={window.location.href}
            authOptions={authOptions}
          /> 
        </div>
      )}
    </div>
  );
}

export default App;
