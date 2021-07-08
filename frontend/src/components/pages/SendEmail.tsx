import { sendLinkToResetPass } from 'actions/user.action';
import React, { useCallback, useState } from 'react'
import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const SendEmail = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  const history = useHistory();

  const dispatch = useDispatch();

  const handleOnChange = (e: { target: { name: string; value: string; }; }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const handleOnSubmit = useCallback(e => {
    e.preventDefault();

    setLoading(true);
    const id = uuidv4();
    dispatch(sendLinkToResetPass(formData, id, history, setLoading));
  }, [dispatch, formData, history]);

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