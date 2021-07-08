import { updateProfile } from 'actions/profile.action';
import { StatusFormState } from 'interfaces';
import React, { useCallback, useState } from 'react';
import { Button, Form, Modal, ModalProps, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

const UpdateStatus = (props: ModalProps) => {
  const [formData, setFormData] = useState<StatusFormState>({});
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
    dispatch(updateProfile(formData, setFormData, id, props.onHide, setLoading));
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
              placeholder="Your status (e.g. student, seller, intern)" />
          </Form.Group>
          <Form.Group controlId="formBasicCompany">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={formData.company ? formData.company : ''}
              name='company'
              onChange={handleOnChange}
              type="text"
              placeholder="Name of e.g. company, school" />
          </Form.Group>
          <Form.Group controlId="formBasicLocation">
            <Form.Label>Location</Form.Label>
            <Form.Control
              value={formData.location ? formData.location : ''}
              name='location'
              onChange={handleOnChange}
              type="text"
              placeholder="Location of e.g. company, school" />
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

export default UpdateStatus;