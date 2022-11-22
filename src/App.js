import { Container, Row, Col } from 'react-bootstrap';
import './App.css';
import Header from './components/header/Header';
import WeatherCard from './components/weatherCard/WeatherCard';

function App() {
  return (
    <div className="App">
      <Header />
      <Container className='p-0'>
        <Row className='align-items-center'>
          {
            [...Array(9)].map((_c, i) => (<Col key={i} className='p-3 m-3'><WeatherCard id={i} /></Col>))
          }
        </Row>
      </Container>
    </div>
  );
}

export default App;
