// import { createSolidDataset, getSolidDataset, saveSolidDatasetAt } from "@inrupt/solid-client"
import 'bootstrap/dist/css/bootstrap.min.css'
import Navigatebar from "./components/navbar"
import Login from "./pages/login"

function App() {

  return (
    <>
    <div className="App">
      <Navigatebar />
      <Login />
    </div>
    </>
  );
}

export default App;
