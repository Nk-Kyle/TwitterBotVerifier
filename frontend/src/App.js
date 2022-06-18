import React,{ useEffect, useState} from 'react'
import './App.css';
import {Container, Form} from 'react-bootstrap'
import Button from 'react-bootstrap/Button'

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [backendData, setBackendData] = useState([{}])

  const handleClick = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      const result = await response.json();

      console.log('result is: ', JSON.stringify(result, null, 4));

      setBackendData(result);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="App">
      <header className="App-header">
        <Container>
          <Form>
            <Form.Label>Twitter User</Form.Label>
            <Form.Control placeholder="@RealElonMusk"></Form.Control>
            <Button variant="outline-primary" onClick={handleClick}> Test </Button>
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