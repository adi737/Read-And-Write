import React, { useCallback, useState } from 'react'
import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { changePassword } from 'actions/user.action';
import { ChangePasswordFormState } from 'interfaces';

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ChangePasswordFormState>({});

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
    dispatch(changePassword(formData, id, history, setLoading));
  }, [dispatch, formData, history]);

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
                placeholder="Password" />
            </Form.Group>
            <Form.Group controlId="formBasicNewPassword">
              <Form.Control
                name='newPassword'
                onChange={handleOnChange}
                required
                minLength={8}
                type="password"
                placeholder="New password" />
            </Form.Group>
            <Form.Group controlId="formBasicNewRepassword">
              <Form.Control
                name='newRepassword'
                onChange={handleOnChange}
                required
                minLength={8}
                type="password"
                placeholder="Repeat new password" />
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