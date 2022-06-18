import React,{ useEffect, useState} from 'react'
import './App.css';
import {Container, Form} from 'react-bootstrap'
import Button from 'react-bootstrap/Button'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Container>
          <Form>
            <Form.Label>Twitter User</Form.Label>
            <Form.Control placeholder="@RealElonMusk"></Form.Control>
            <Button variant="outline-primary"> Test </Button>
          </Form>
        
        </Container>
        
        
      </header>
    </div>
  );
}

export default App;

// import React,{ useEffect, useState} from 'react'
// import Button from 'react-bootstrap/Button'

// function App() {

//   const [backendData, setBackendData] = useState([{}])

//   useEffect(() => {
//     fetch("/api").then(
//       response => response.json()
//     ).then(
//       data => {
//         setBackendData(data)
//       }
//     )
//   }, [])
//   return (
//     <Button> Test </Button>
//   )
// }

// export default App