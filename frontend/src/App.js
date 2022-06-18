import React,{ useEffect, useRef, useState} from 'react'
import './App.css';
import {Container, Form, Card, Button, Navbar} from 'react-bootstrap'

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [cosineVal, setCosineVal] = useState(0);
  const [gotData, setData] = useState(false)
  const [image, setImage] = useState('')
  const [url, setUrl] = useState('')
  const account = useRef(null);

  const handleClick = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('https://twitter-bot-verifier-backend.vercel.app/'+account.current.value, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        setImage('');
        setData(false);
        setUrl('https://twitter.com/')
        throw new Error(`Error! status: ${response.status}`);
      }

      const result = await response.json();

      console.log('result is: ', JSON.stringify(result, null, 4));
      setData(true);
      setImage(result.imageURL);
      setCosineVal(result.cosine);
      setUrl('https://twitter.com/'+result.username);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="App">
      <Navbar bg= "primary">
        <Container>
          <Navbar.Brand>Twitter Buzzer Checker V1</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Developed by: <a href="https://github.com/Nk-Kyle">Ng Kyle</a>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <header className="App-header">
      
        <Container>
          <Form className="mb-3">
            <Form.Label>Twitter User</Form.Label>
            <Form.Control className="mb-3" placeholder="@RealElonMusk" ref={account}></Form.Control>
            <Button size = 'lg' variant="outline-primary" onClick={handleClick}>{isLoading ? 'Loading…' : 'Check Account'}</Button>
          </Form>
        
        </Container>

        <Card style={{ width: '18rem' }}>
          <Card.Img variant="top" src= {image} />
          <Card.Body>
            <Card.Title>Card Title</Card.Title>
            <Card.Text className='link-dark' >
              {gotData ? parseFloat(cosineVal*100).toFixed(2)+"%" : "No Account"}
              {gotData ? cosineVal > 0.8 ? " Buzzer Indicated" : " Normal" : ""}
            </Card.Text>
            <Button variant="primary" href={url} target="_blank">Account Link</Button>
          </Card.Body>
        </Card>
        
        
      </header>
    </div>
  );
}

export default App;