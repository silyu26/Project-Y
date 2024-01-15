import { useEffect, useState } from "react";
import { Container, Row, Modal, Button, Image} from "react-bootstrap";
import { Card } from "react-bootstrap";


const GoalComponent = ()=> {


    const [modalOpen, setModalOpen] = useState(false)


    useEffect(() => {
      
    },[])

    const openModal = () => {
      setModalOpen(true)
    }
    const closeModal = () => {
      setModalOpen(false)
    }
    

    return (
        <Container>

          <Modal show={modalOpen} onHide={closeModal} size="md">
            <Modal.Header closeButton>
            <Modal.Title>Change your goals</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            </Modal.Body>
          </Modal>

          <Row>
            <Card style={{ width: '14rem' }} className="text-center">
              <hr />
              <Card.Body>
                <Card.Title></Card.Title><br/>
                <Card.Text >
                </Card.Text>
              </Card.Body>
            </Card>
          </Row>  
        </Container>
    )
}

export default GoalComponent