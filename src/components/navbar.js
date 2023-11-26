import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'

function Navigatebar() {

    return(
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">PROJECT Y</Navbar.Brand>
        </Container>
      </Navbar>
    )
} 

export default Navigatebar