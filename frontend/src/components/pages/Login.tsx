import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { LoginState, State } from 'interfaces';
import api from 'helpers/api';
import { useMutation, useQueryClient } from 'react-query';
import { toErrorMap } from 'helpers/toErrorMap';
import { LOGIN_USER } from 'reducers/types';

const Login = () => {
  const [formData, setFormData] = useState<LoginState>({});
  const [error, setError] = useState<any>(null);
  const dispatch = useDispatch();
  const isLogged = useSelector((state: State) => state.user.isLogged);
  const queryClient = useQueryClient();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const login = async () => {
    const { data } = await api.post('/user/login', formData);
    return data;
  }

  const { mutate, isLoading } = useMutation(login, {
    onSuccess(data) {
      dispatch({
        type: LOGIN_USER,
        payload: data.token,
        userID: data.userID
      });

      queryClient.clear();
    },
    onError(err: any) {
      setError(toErrorMap(err.response.data.errors));
    }
  });

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate();
  }


  return isLogged ?
    <Redirect to='/profile' />
    :
    <Container className='mt-4'>
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <Form onSubmit={handleOnSubmit}>
            {
              error?.invalid ? <Alert className="mt-2" variant='danger'>{error.invalid}</Alert> : null
            }
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control onChange={handleOnChange} required type="email" placeholder="Enter email" name='email' />
              <Form.Text className="text-muted">
                Don't have an account yet? <Link to='register'>Sign up</Link>
              </Form.Text>
              {
                error?.email ? <Alert className="mt-2" variant='danger'>{error.email}</Alert> : null
              }
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                className='input-form'
                onChange={handleOnChange}
                minLength={8}
                required
                type="password"
                placeholder="Password"
                name='password'
              />
              <Form.Text className="text-muted">
                Forgot your password? <Link to='email'>Reset password</Link>
              </Form.Text>
              {
                error?.password ? <Alert className="mt-2" variant='danger'>{error.password}</Alert> : null
              }
            </Form.Group>

            {
              isLoading ?
                <Button variant="primary" disabled>
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