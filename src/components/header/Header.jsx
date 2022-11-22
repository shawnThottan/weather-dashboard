import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMeteor } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header = () => {
  return (
    <Navbar>
      <Container>
        <Navbar.Brand>
          <h3 className='m-3'>
            <FontAwesomeIcon icon={faMeteor} className='fa-lg mx-2' />Weather Dashboard
          </h3>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Header;