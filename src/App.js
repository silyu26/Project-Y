// import { createSolidDataset, getSolidDataset, saveSolidDatasetAt } from "@inrupt/solid-client"
import 'bootstrap/dist/css/bootstrap.min.css'
import Navigatebar from "./components/navbar"
import Footer from "./components/footer"
import Correlation from "./pages/correlation"
import Share from "./pages/share"
import Manageaccount from './pages/manageaccount';
import Managepod from './pages/managepod';
import Settings from './pages/settings';
import Home from "./pages/home"


import Container from 'react-bootstrap/Container';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import PodConnectionSuggestion from './components/correlations/connection'

function App() {
  return (
    <div className="App" style={{ overflow: 'visible', maxHeight: '80vh', maxWidth: '100%' }}>
      <Container >
        <BrowserRouter>
          <Navigatebar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pages/correlation" element={<PodConnectionSuggestion />} />
            <Route path="/pages/suggestions" element={<PodConnectionSuggestion />} />
            {/*<Route path="/pages/login" element={<Login />} />*/}

            <Route path="/pages/share" element={<Share />} />
            <Route path="/pages/manageaccount" element={<Manageaccount />} />
            <Route path="/pages/managepod" element={<Managepod />} />
            <Route path="/pages/settings" element={<Settings />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </Container>
    </div>

  );
}

export default App;
