//import React from 'react';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const ConnectSensor = () => {
  const queryParameters = new URLSearchParams(window.location.search)
  const code = queryParameters.get("code")
  const state = queryParameters.get("state")
//   downloadTxtFile = () => {
//     const element = document.createElement("a");
//     const file = new Blob([document.getElementById('myInput').value], {type: 'text/plain'});
//     element.href = URL.createObjectURL(file);
//     element.download = "myFile.txt";
//     document.body.appendChild(element); // Required for this to work in FireFox
//     element.click();
//   }




    return (
        <div>
        <br />
            <h2 className='text-center'>Manage Pod</h2>
            {code}
            {state}
            <div>
    </div>

        <hr />
        <br />
        </div>  
    );
}

export default ConnectSensor;