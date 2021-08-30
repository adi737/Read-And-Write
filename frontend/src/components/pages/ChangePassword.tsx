import React, { useState } from 'react'
import { Alert, Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { ChangePasswordFormState } from 'interfaces';
import api from 'helpers/api';
import { useMutation } from 'react-query';
import { toErrorMap } from 'helpers/toErrorMap';

const ChangePassword = () => {
  const [formData, setFormData] = useState<ChangePasswordFormState>({});
  const [error, setError] = useState<any>(null);
  const [success, setSuccess] = useState(false);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const changePassword = async () => {
    await api.patch(`/user/change`, formData);
  }

  const { mutate, isLoading } = useMutation(changePassword, {
    onSuccess() {
      setError(null);
      setSuccess(true);
    },
    onError(err: any) {
      setSuccess(false);
      setError(toErrorMap(err.response.data.errors));
    }
  });

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate();
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
                minLength={8}
                type="password"
                placeholder="Password"
              />
              {
                error?.password ? <Alert className="mt-2" variant='danger'>{error.password}</Alert> : null
              }
            </Form.Group>
            <Form.Group controlId="formBasicNewPassword">
              <Form.Control
                name='newPassword'
                onChange={handleOnChange}
                required
                minLength={8}
                type="password"
                placeholder="New password"
              />
              {
                error?.newPassword ? <Alert className="mt-2" variant='danger'>{error.newPassword}</Alert> : null
              }
            </Form.Group>
            <Form.Group controlId="formBasicNewRepassword">
              <Form.Control
                name='newRepassword'
                onChange={handleOnChange}
                required
                minLength={8}
                type="password"
                placeholder="Repeat new password"
              />
              {
                error?.newRepassword ? <Alert className="mt-2" variant='danger'>{error.newRepassword}</Alert> : null
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
                  Change password
                </Button>
            }
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default ChangePassword;