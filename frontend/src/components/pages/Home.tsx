import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { State } from 'interfaces';

const Home = () => {
  const isLogged = useSelector((state: State) => state.user.isLogged);

  return (
    <div className="landing">
      <div className="home-container d-flex align-items-center justify-content-center text-center">
        <Container>
          <Row xs={1}>
            <Col className='h4'>Welcome to Read&Write app</Col>
            <Col className='h5'>This app has been created to read and write various articles</Col>
          </Row>

          {
            !isLogged ?
              <Row xs={1}>
                <Col className='h6'>If you want to add your own article or create a profile click button below to login</Col>
                <Col>
                  <Link to='/login'><Button variant='success'>Login</Button></Link>
                </Col>
              </Row>
              :
              null
          }
        </Container>
      </div>
    </div>
  )
}

export default Home;