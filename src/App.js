// import { createSolidDataset, getSolidDataset, saveSolidDatasetAt } from "@inrupt/solid-client"
import 'bootstrap/dist/css/bootstrap.min.css'
import Navigatebar from "./components/navbar"
import Footer from "./components/footer"


import Correlation from "./pages/correlation"
import Suggestions from "./pages/suggestions"
import Share from "./pages/share"
import Manageaccount from './pages/manageaccount';
import Managepod from './pages/managepod';
import Settings from './pages/settings';
import Home from "./pages/home"
import Login from "./pages/login"

import Container from 'react-bootstrap/Container';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import React from 'react';

function App() {


  return (
    <div className="App"style={{ overflowY: 'auto', maxHeight: '100vh', maxWidth: '100%'}}>
      <Container >
        <BrowserRouter>
        <Navigatebar />   
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pages/correlation" element={<Correlation />} />
            <Route path="/pages/suggestions" element={<Suggestions />} />
            <Route path="/pages/login" element={<Login />} />

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
