import api from 'helpers/api';
import { toErrorMap } from 'helpers/toErrorMap';
import { EducationFormState } from 'interfaces';
import React, { useState } from 'react';
import { Alert, Button, Form, Modal, ModalProps, Spinner } from 'react-bootstrap';
import { useMutation, useQueryClient } from 'react-query';

const AddEducation = (props: ModalProps) => {
  const [formData, setFormData] = useState<EducationFormState>({});
  const [error, setError] = useState<any>(null);
  const queryClient = useQueryClient();


  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const addEducation = async () => {
    const { data } = await api.post('/profile/education', formData);
    return data;
  }

  const { mutate, isLoading } = useMutation(addEducation, {
    onSuccess(updatedProfile) {
      queryClient.setQueryData(['myProfile',], updatedProfile);
      props.onHide();
    },
    onError(err: any) {
      console.log(err.response.data.errors)
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
          Add Education
      </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleOnSubmit}>
        <Modal.Body>
          <Form.Group controlId="formBasicSchool">
            <Form.Label>School</Form.Label>
            <Form.Control
              value={formData.school ? formData.school : ''}
              required
              name='school'
              onChange={handleOnChange}
              type="text"
              placeholder="Your school"
            />
            {
              error?.school ? <Alert className="mt-2" variant='danger'>{error.school}</Alert> : null
            }
          </Form.Group>
          <Form.Group controlId="formBasicField">
            <Form.Label>Field of study</Form.Label>
            <Form.Control
              value={formData.fieldofstudy ? formData.fieldofstudy : ''}
              name='fieldofstudy'
              onChange={handleOnChange}
              type="text"
              placeholder="Field of your study"
            />
            {
              error?.fieldOfStudy ? <Alert className="mt-2" variant='danger'>{error.fieldOfStudy}</Alert> : null
            }
          </Form.Group>
          <Form.Group controlId="formBasicDegree">
            <Form.Label>Degree</Form.Label>
            <Form.Control
              value={formData.degree ? formData.degree : ''}
              name='degree'
              onChange={handleOnChange}
              type="text"
              placeholder="Your degree"
            />
            {
              error?.degree ? <Alert className="mt-2" variant='danger'>{error.degree}</Alert> : null
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

export default AddEducation;