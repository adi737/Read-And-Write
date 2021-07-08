import React, { useState, useCallback, useEffect } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { cleanUserState, registerUser } from 'actions/user.action';
import { v4 as uuidv4 } from 'uuid';
import { Col, Container, Form, Button, Row, Spinner } from 'react-bootstrap';
import { State } from 'interfaces';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({})

  const isLogged = useSelector((state: State) => state.user.isLogged);

  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(cleanUserState());
    }
  }, [dispatch]);


  const onChange = useCallback((e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }, [formData])

  const onSubmit = useCallback(e => {
    e.preventDefault();

    setLoading(true);
    const id = uuidv4();
    dispatch(registerUser(formData, id, history, setLoading));
  }, [dispatch, formData, history]);

  return isLogged ?
    <Redirect to='/profile' />
    :
    <Container className='mt-4'>
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <Form onSubmit={onSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control onChange={onChange} required type="email" placeholder="Enter email" name='email' />
              <Form.Text className="text-muted">
                Already have an account? <Link to='login'>Sign in</Link>
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control className='input-form' onChange={onChange} minLength={8} required type="password" placeholder="Password" name='password' />
            </Form.Group>

            <Form.Group controlId="formBasicRepeatPassword">
              <Form.Label>Repeat password</Form.Label>
              <Form.Control className='input-form' onChange={onChange} minLength={8} required type="password" placeholder="Repeat password" name='repassword' />
            </Form.Group>

            <Form.Group controlId="formBasicNickname">
              <Form.Label>Nickname</Form.Label>
              <Form.Control className='input-form' onChange={onChange} required type="text" placeholder="Nick" name='nick' />
            </Form.Group>

            {
              loading ?
                <Button variant="primary" type="submit" disabled>
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  /> loading...
                </Button>
                :
                <Button variant="primary" type="submit">
                  Sign up
                </Button>
            }
          </Form>
        </Col>
      </Row>
    </Container >
}

export default Register;