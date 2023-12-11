import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Connectsensor(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Connect your sensor
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Which sensor would you like to connect?</h4>
        <p>
          Here you will be able to connect your sensor.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Connectsensor