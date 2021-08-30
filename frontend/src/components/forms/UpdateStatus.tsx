import api from 'helpers/api';
import { toErrorMap } from 'helpers/toErrorMap';
import { StatusFormState } from 'interfaces';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal, ModalProps, Spinner } from 'react-bootstrap';
import { useMutation, useQueryClient } from 'react-query';


const UpdateStatus = (props: ModalProps) => {
  const [formData, setFormData] = useState<StatusFormState>({});
  const [error, setError] = useState<any>(null);
  const queryClient = useQueryClient();
  const myProfile: any = queryClient.getQueryData('myProfile');

  const updateProfile = async () => {
    const { data } = await api.patch('/profile', formData);
    return data;
  }

  const { mutate, isLoading } = useMutation(updateProfile, {
    onSuccess(updatedProfile) {
      const profilesCache = queryClient.getQueryData('profiles');
      const profileCache = queryClient.getQueryData(['profile', updatedProfile._id]);

      if (profilesCache) {
        queryClient.setQueryData('profiles', (profiles: any) =>
          profiles.map(profile => profile._id === updatedProfile._id ? updatedProfile : profile))
      }

      if (profileCache) {
        queryClient.setQueryData(['profile', updatedProfile._id], updatedProfile);
      }

      queryClient.setQueryData('myProfile', updatedProfile);
      props.onHide();
    },
    onError(err: any) {
      console.log(err.response.data.errors)
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

  useEffect(() => {
    setFormData({
      status: myProfile.status ?? '',
      company: myProfile.company ?? '',
      location: myProfile.location ?? ''
    });
  }, [myProfile]);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Update Status
      </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleOnSubmit}>
        <Modal.Body>
          <Form.Group controlId="formBasicStatus">
            <Form.Label>Status</Form.Label>
            <Form.Control
              value={formData.status ? formData.status : ''}
              required
              name='status'
              onChange={handleOnChange}
              type="text"
              placeholder="Your status (e.g. student, seller, intern)"
            />
            {
              error?.status ? <Alert className="mt-2" variant='danger'>{error.status}</Alert> : null
            }
          </Form.Group>
          <Form.Group controlId="formBasicCompany">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={formData.company ? formData.company : ''}
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
              value={formData.location ? formData.location : ''}
              name='location'
              onChange={handleOnChange}
              type="text"
              placeholder="Location of e.g. company, school"
            />
            {
              error?.location ? <Alert className="mt-2" variant='danger'>{error.location}</Alert> : null
            }
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={props.onHide}
            variant="secondary">
            Close
          </Button>
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
              <Button
                type='submit'
                variant="primary">
                Save changes
              </Button>
          }
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default UpdateStatus;