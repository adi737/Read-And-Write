import { addEducation } from 'actions/profile.action';
import { EducationFormState } from 'interfaces';
import React, { useCallback, useState } from 'react';
import { Button, Form, Modal, ModalProps, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

const AddEducation = (props: ModalProps) => {
  const [formData, setFormData] = useState<EducationFormState>({});
  const [loading, setLoading] = useState(false);

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
    dispatch(addEducation(formData, setFormData, id, props.onHide, setLoading));
  }, [dispatch, formData, props.onHide]);
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
          </Form.Group>
          <Form.Group controlId="formBasicTo">
            <Form.Label>To</Form.Label>
            <Form.Control
              value={formData.to ? formData.to : ''}
              name='to'
              onChange={handleOnChange}
              type='date'
            />
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
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={props.onHide}
            variant="secondary">
            Close
        </Button>
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
                Save changes
              </Button>
          }
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddEducation;