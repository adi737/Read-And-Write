import api from 'helpers/api';
import { toErrorMap } from 'helpers/toErrorMap';
import { ExperienceFormState } from 'interfaces';
import React, { useState } from 'react';
import { Alert, Button, Form, Modal, ModalProps, Spinner } from 'react-bootstrap';
import { useMutation, useQueryClient } from 'react-query';

const AddExperience = (props: ModalProps) => {
  const [formData, setFormData] = useState<ExperienceFormState>({});
  const [error, setError] = useState<any>(null);
  const queryClient = useQueryClient();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const addExperience = async () => {
    const { data } = await api.post('/profile/experience', formData);
    return data;
  }

  const { mutate, isLoading } = useMutation(addExperience, {
    onSuccess(updatedProfile) {
      queryClient.setQueryData(['myProfile',], updatedProfile);
      props.onHide();
    },
    onError(err: any) {
      setError(toErrorMap(err.response.data.errors));
    }
  });

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
          Add Experience
      </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleOnSubmit}>
        <Modal.Body>
          <Form.Group controlId="formBasicPosition">
            <Form.Label>Position</Form.Label>
            <Form.Control
              value={formData.position ? formData.position : ''}
              required
              name='position'
              onChange={handleOnChange}
              type="text"
              placeholder="Your position"
            />
            {
              error?.position ? <Alert className="mt-2" variant='danger'>{error.position}</Alert> : null
            }
          </Form.Group>
          <Form.Group controlId="formBasicCompany">
            <Form.Label>Company</Form.Label>
            <Form.Control
              value={formData.company ? formData.company : ''}
              required
              name='company'
              onChange={handleOnChange}
              type="text"
              placeholder="Your company"
            />
            {
              error?.company ? <Alert className="mt-2" variant='danger'>{error.company}</Alert> : null
            }
          </Form.Group>
          <Form.Group controlId="formBasicLocation">
            <Form.Label>Location</Form.Label>
            <Form.Control
              value={formData.location ? formData.location : ''}
              required
              name='location'
              onChange={handleOnChange}
              type="text"
              placeholder="Your company location"
            />
            {
              error?.location ? <Alert className="mt-2" variant='danger'>{error.location}</Alert> : null
            }
          </Form.Group>
          <Form.Group controlId="formBasicFrom">
            <Form.Label>From</Form.Label>
            <Form.Control
              value={formData.from ? formData.from : ''}
              required
              name='from'
              onChange={handleOnChange}
              type='date'
            />
            {
              error?.from ? <Alert className="mt-2" variant='danger'>{error.from}</Alert> : null
            }
          </Form.Group>
          <Form.Group controlId="formBasicTo">
            <Form.Label>To</Form.Label>
            <Form.Control
              value={formData.to ? formData.to : ''}
              name='to'
              onChange={handleOnChange}
              type='date'
            />
            {
              error?.to ? <Alert className="mt-2" variant='danger'>{error.to}</Alert> : null
            }
          </Form.Group>
          <Form.Group controlId="formBasicTextarea">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={formData.description ? formData.description : ''}
              as="textarea"
              rows={6}
              name='description'
              onChange={handleOnChange}
              placeholder="Description..."
            />
            {
              error?.description ? <Alert className="mt-2" variant='danger'>{error.description}</Alert> : null
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

export default AddExperience;