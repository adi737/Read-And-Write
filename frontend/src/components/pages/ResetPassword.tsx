import React, { useCallback, useState } from 'react'
import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { resetPassword } from 'actions/user.action';

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  const history = useHistory();
  const { token } = useParams<{ token: string }>();

  const dispatch = useDispatch();

  const handleOnChange = (e: { target: { name: string; value: string; }; }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const handleOnSubmit = useCallback(e => {
    e.preventDefault();

    const id = uuidv4();
    setLoading(true);
    dispatch(resetPassword(formData, id, history, token, setLoading));
  }, [dispatch, formData, history, token]);

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
                placeholder="Password" />
            </Form.Group>
            <Form.Group controlId="formBasicRepassword">
              <Form.Control
                name='repassword'
                onChange={handleOnChange}
                required type="password"
                placeholder="Repeat password" />
            </Form.Group>
            {
              loading ?
                <Button block variant="primary" type="submit" disabled>
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