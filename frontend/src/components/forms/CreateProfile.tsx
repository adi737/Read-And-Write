import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProfile } from 'actions/profile.action';
import { v4 as uuidv4 } from 'uuid';
import { Button, Container, Form, Spinner } from 'react-bootstrap';
import { ProfileFormState } from 'interfaces';

interface CreateProfileState {
  history: {
    push: Function;
  }
}

const CreateProfile: React.FC<CreateProfileState> = ({ history: { push } }) => {
  const [formData, setFormData] = useState<ProfileFormState>({});
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleOnChange = useCallback(e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }, [formData]);


  const handleOnSubmit = useCallback(e => {
    e.preventDefault();

    setLoading(true);
    const id = uuidv4();
    dispatch(createProfile(formData, push, id, setLoading))
  }, [dispatch, push, formData])

  return (
    <Container className='my-3'>
      <Form onSubmit={handleOnSubmit}>
        <Form.Group controlId="formBasicStatus">
          <Form.Label>Status</Form.Label>
          <Form.Control
            required
            name='status'
            onChange={handleOnChange}
            type="text"
            placeholder="Your status (e.g. student, seller, intern)"
          />
        </Form.Group>
        <Form.Group controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            name='company'
            onChange={handleOnChange}
            type="text"
            placeholder="Name of e.g. company, school"
          />
        </Form.Group>
        <Form.Group controlId="formBasicLocation">
          <Form.Label>Location</Form.Label>
          <Form.Control
            name='location'
            onChange={handleOnChange}
            type="text"
            placeholder="Location of e.g. company, school"
          />
        </Form.Group>
        <Form.Group controlId="formBasicSkills">
          <Form.Label>Skills</Form.Label>
          <Form.Control
            required
            name='skills'
            onChange={handleOnChange}
            type="text"
            placeholder="Your skills (split by comma)"
          />
        </Form.Group>
        <Form.Group controlId="formBasicLinkedIn">
          <Form.Label>LinkedIn</Form.Label>
          <Form.Control
            name='linkedin'
            onChange={handleOnChange}
            type="text"
            placeholder="LinkedIn link" />
        </Form.Group>
        <Form.Group controlId="formBasicFacebook">
          <Form.Label>Facebook</Form.Label>
          <Form.Control
            name='facebook'
            onChange={handleOnChange}
            type="text"
            placeholder="Facebook link" />
        </Form.Group>
        <Form.Group controlId="formBasicInstagram">
          <Form.Label>Instagram</Form.Label>
          <Form.Control
            name='instagram'
            onChange={handleOnChange}
            type="text"
            placeholder="Instagram link" />
        </Form.Group>
        <Form.Group controlId="formBasicYoutube">
          <Form.Label>Youtube</Form.Label>
          <Form.Control
            name='youtube'
            onChange={handleOnChange}
            type="text"
            placeholder="Youtube link" />
        </Form.Group>
        <Form.Group controlId="formBasicTwitter">
          <Form.Label>Twitter</Form.Label>
          <Form.Control
            name='twitter'
            onChange={handleOnChange}
            type="text"
            placeholder="Twitter link" />
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
            <Button
              type='submit'
              variant="primary">
              Create profile
            </Button>
        }
      </Form>
    </Container>
  );
}

export default CreateProfile;