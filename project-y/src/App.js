import { LoginButton } from "@inrupt/solid-ui-react"

const authOptions = {
  clientName: "Solid Project Y",
}

function App() {
  return (
    <div className="App">

      <LoginButton className="align-self-center"
          oidcIssuer="https://lab.wirtz.tech/"
          redirectUrl={window.location.href}
          authOptions={authOptions}
      />
    </div>
  );
}

export default App;
