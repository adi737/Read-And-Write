import React, { useState } from 'react';
import { Alert, Button, Form, Modal, ModalProps, Spinner } from 'react-bootstrap';
import { ProfileFormState } from 'interfaces';
import { useMutation, useQueryClient } from 'react-query';
import { toErrorMap } from 'helpers/toErrorMap';
import api from 'helpers/api';


const CreateProfile = (props: ModalProps) => {
  const [formData, setFormData] = useState<ProfileFormState>({});
  const [error, setError] = useState<any>(null);
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(() =>
    api.post('/profile', formData).then(res => res.data), {
    onSuccess(profile) {
      const profilesCache = queryClient.getQueryData('profiles');

      if (profilesCache) {
        queryClient.setQueryData('profiles', (profiles: any) => [profile, ...profiles]);
      }

      queryClient.setQueryData('myProfile', profile);

      props.onHide();
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

    mutate();
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create profile
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleOnSubmit}>
        <Modal.Body>
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
          {
            error?.status ? <Alert className="mt-2" variant='danger'>{error.status}</Alert> : null
          }
          <Form.Group controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name='company'
              onChange={handleOnChange}
              type="text"
              placeholder="Name of e.g. company, school"
            />
            {
              error?.company ? <Alert className="mt-2" variant='danger'>{error.company}</Alert> : null
            }
          </Form.Group>
          <Form.Group controlId="formBasicLocation">
            <Form.Label>Location</Form.Label>
            <Form.Control
              name='location'
              onChange={handleOnChange}
              type="text"
              placeholder="Location of e.g. company, school"
            />
            {
              error?.location ? <Alert className="mt-2" variant='danger'>{error.location}</Alert> : null
            }
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
            {
              error?.skills ? <Alert className="mt-2" variant='danger'>{error.skills}</Alert> : null
            }
          </Form.Group>
          <Form.Group controlId="formBasicLinkedIn">
            <Form.Label>LinkedIn</Form.Label>
            <Form.Control
              name='linkedin'
              onChange={handleOnChange}
              type="text"
              placeholder="LinkedIn link" />
            {
              error?.linkedin ? <Alert className="mt-2" variant='danger'>{error.linkedin}</Alert> : null
            }
          </Form.Group>
          <Form.Group controlId="formBasicFacebook">
            <Form.Label>Facebook</Form.Label>
            <Form.Control
              name='facebook'
              onChange={handleOnChange}
              type="text"
              placeholder="Facebook link" />
            {
              error?.facebook ? <Alert className="mt-2" variant='danger'>{error.facebook}</Alert> : null
            }
          </Form.Group>
          <Form.Group controlId="formBasicInstagram">
            <Form.Label>Instagram</Form.Label>
            <Form.Control
              name='instagram'
              onChange={handleOnChange}
              type="text"
              placeholder="Instagram link" />
            {
              error?.instagram ? <Alert className="mt-2" variant='danger'>{error.instagram}</Alert> : null
            }
          </Form.Group>
          <Form.Group controlId="formBasicYoutube">
            <Form.Label>Youtube</Form.Label>
            <Form.Control
              name='youtube'
              onChange={handleOnChange}
              type="text"
              placeholder="Youtube link" />
            {
              error?.youtube ? <Alert className="mt-2" variant='danger'>{error.youtube}</Alert> : null
            }
          </Form.Group>
          <Form.Group controlId="formBasicTwitter">
            <Form.Label>Twitter</Form.Label>
            <Form.Control
              name='twitter'
              onChange={handleOnChange}
              type="text"
              placeholder="Twitter link" />
            {
              error?.twitter ? <Alert className="mt-2" variant='danger'>{error.twitter}</Alert> : null
            }
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
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
              <Button
                type='submit'
                variant="primary">
                Create profile
              </Button>
          }
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default CreateProfile;