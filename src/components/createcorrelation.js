import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Createcorrelation(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Creat a new correlation
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Which correlation would you like to create?</h4>
        <p>
          Here you will be able to create a new correlation.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Createcorrelation