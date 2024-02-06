// import { createSolidDataset, getSolidDataset, saveSolidDatasetAt } from "@inrupt/solid-client"
import 'bootstrap/dist/css/bootstrap.min.css'
import Navigatebar from "./components/navbar"
import Footer from "./components/footer"
import Share from "./pages/share"
import Manageaccount from './pages/manageaccount';
import Managepod from './pages/managepod';
import ConnectSensor from './pages/connectSensor';
import Settings from './pages/settings';
import Home from "./pages/home"


import Container from 'react-bootstrap/Container';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import PodConnectionSuggestion from './components/correlations/connection'

function App() {

  return (
    <div className="App" style={{ overflow: 'visible', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BrowserRouter>
        <Navigatebar />
        <Container style={{ flex: 1, overflow: 'auto' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pages/correlation" element={<PodConnectionSuggestion />} />
            <Route path="/pages/suggestions" element={<PodConnectionSuggestion />} />
            {/*<Route path="/pages/login" element={<Login />} />*/}
            <Route path="/pages/goals" element={<PodConnectionSuggestion />} />
            <Route path="/pages/share" element={<Share />} />
            <Route path="/pages/manageaccount" element={<Manageaccount />} />
            <Route path="/pages/managepod" element={<Managepod />} />
            <Route path="/pages/connectSensor" element={<ConnectSensor />} />
            <Route path="/pages/settings" element={<Settings />} />
          </Routes>
        </Container>
        <Footer />
      </BrowserRouter>
    </div>

  );
}

export default App;
