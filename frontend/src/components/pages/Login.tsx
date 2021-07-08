import React, { useState, useCallback, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { cleanUserState, loginUser } from 'actions/user.action';
import { v4 as uuidv4 } from 'uuid';
import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { LoginState, State } from 'interfaces';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LoginState>({});

  const isLogged = useSelector((state: State) => state.user.isLogged);

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
    dispatch(loginUser(formData, id, setLoading));
  }, [dispatch, formData]);


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
                Don't have an account yet? <Link to='register'>Sign up</Link>
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control className='input-form' onChange={onChange} minLength={8} required type="password" placeholder="Password" name='password' />
              <Form.Text className="text-muted">
                Forgot your password? <Link to='email'>Reset password</Link>
              </Form.Text>
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
                  Sign in
                </Button>
            }
          </Form>
        </Col>
      </Row>
    </Container >
}

export default Login;