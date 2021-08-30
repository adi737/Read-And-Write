import React, { useState } from 'react'
import { Alert, Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import api from 'helpers/api';
import { useMutation } from 'react-query';
import { toErrorMap } from 'helpers/toErrorMap';


const ResetPassword = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState<any>(null);
  const [success, setSuccess] = useState(false);
  const { token } = useParams<{ token: string }>();
  const { mutate: resetPassword, isLoading } = useMutation(() => api.patch(`/user/reset/${token}`, formData), {
    onSuccess() {
      setError(null);
      setSuccess(true);
    },
    onError(err: any) {
      setSuccess(false);
      setError(toErrorMap(err.response.data.errors));
    }
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    resetPassword();
  }

  return (
    <Container className='mt-5 text-center'>
      <Row>
        <Col xs={{ offset: 2, span: 8 }} md={{ offset: 4, span: 4 }}>
          <Form onSubmit={handleOnSubmit}>
            <Form.Group controlId="formBasicPassword">
              <Form.Control
                name='password'
                onChange={handleOnChange}
                required
                type="password"
                placeholder="Password"
              />
              {
                error?.password ? <Alert className="mt-2" variant='danger'>{error.password}</Alert> : null
              }
            </Form.Group>
            <Form.Group controlId="formBasicRepassword">
              <Form.Control
                name='repassword'
                onChange={handleOnChange}
                required type="password"
                placeholder="Repeat password"
              />
              {
                error?.repassword ? <Alert className="mt-2" variant='danger'>{error.repassword}</Alert> : null
              }
              {
                success ? <Alert className="mt-2" variant='success'>Password has been changed</Alert> : null
              }
            </Form.Group>
            {
              isLoading ?
                <Button block variant="primary" disabled>
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  /> loading...
                </Button>
                :
                <Button block variant="primary" type="submit">
                  Reset password
                </Button>
            }
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default ResetPassword;