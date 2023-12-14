import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
function Enterdata(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Enter your data
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Which data would you like to add?</h4>
        <p>
          Here you will be able to enter your data.
        </p>
        
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Enterdata