import React, { useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Col, Container, Form, Button, Row, Spinner, Alert } from 'react-bootstrap';
import { State } from 'interfaces';
import api from 'helpers/api';
import { useMutation } from 'react-query';
import { toErrorMap } from 'helpers/toErrorMap';

const Register = () => {
  const [formData, setFormData] = useState({})
  const [error, setError] = useState<any>(null);
  const isLogged = useSelector((state: State) => state.user.isLogged);
  const { push } = useHistory();
  const { mutate: register, isLoading } = useMutation(() => api.post('/user/register', formData), {
    onSuccess() {
      push('/activateMessage')
    },
    onError(err: any) {
      setError(toErrorMap(err.response.data.errors));
    }
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    register();
  }

  return isLogged ?
    <Redirect to='/profile' />
    :
    <Container className='mt-4'>
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <Form onSubmit={handleOnSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control onChange={handleOnChange} required type="email" placeholder="Enter email" name='email' />
              <Form.Text className="text-muted">
                Already have an account? <Link to='login'>Sign in</Link>
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
              {
                error?.password ? <Alert className="mt-2" variant='danger'>{error.password}</Alert> : null
              }
            </Form.Group>

            <Form.Group controlId="formBasicRepeatPassword">
              <Form.Label>Repeat password</Form.Label>
              <Form.Control
                className='input-form'
                onChange={handleOnChange}
                minLength={8}
                required
                type="password"
                placeholder="Repeat password"
                name='repassword'
              />
              {
                error?.repassword ? <Alert className="mt-2" variant='danger'>{error.repassword}</Alert> : null
              }
            </Form.Group>

            <Form.Group controlId="formBasicNickname">
              <Form.Label>Nickname</Form.Label>
              <Form.Control
                className='input-form'
                onChange={handleOnChange}
                required
                type="text"
                placeholder="Nick"
                name='nick'
              />
              {
                error?.nick ? <Alert className="mt-2" variant='danger'>{error.nick}</Alert> : null
              }
            </Form.Group>

            {
              isLoading ?
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