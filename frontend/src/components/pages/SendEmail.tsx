import api from 'helpers/api';
import { toErrorMap } from 'helpers/toErrorMap';
import React, { useState } from 'react'
import { Alert, Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router';


const SendEmail = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState<any>(null);
  const { push } = useHistory();
  const { mutate: sendEmail, isLoading } = useMutation(() => api.post('/user/send', formData), {
    onSuccess() {
      push('/resetMessage');
    },
    onError(err: any) {
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

    sendEmail();
  }

  return (
    <Container className='mt-5 text-center'>
      <Row>
        <Col xs={{ offset: 2, span: 8 }} md={{ offset: 4, span: 4 }}>
          <Form onSubmit={handleOnSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                name='email'
                onChange={handleOnChange}
                type="email"
                required
                placeholder="Enter email"
              />
              {
                error?.email ? <Alert className="mt-2" variant='danger'>{error.email}</Alert> : null
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
                  Submit
                </Button>
            }
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default SendEmail;