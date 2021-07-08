import { updateProfile } from 'actions/profile.action';
import { SkillsFormState, State } from 'interfaces';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, Modal, ModalProps, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

const UpdateSkills = (props: ModalProps) => {
  const [formData, setFormData] = useState<SkillsFormState>({});
  const [loading, setLoading] = useState(false);

  const skills = useSelector((state: State) => state.profile.profile.skills);

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

  useEffect(() => {
    setFormData({ skills: skills.map(skill => ` ${skill}`) });
  }, [skills]);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Update Skills
      </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleOnSubmit}>
        <Modal.Body>
          <Form.Group controlId="formBasicSkills">
            <Form.Label>Skills</Form.Label>
            <Form.Control
              value={formData.skills ? formData.skills : ''}
              required
              name='skills'
              onChange={handleOnChange}
              type="text"
              placeholder="Your skills (split by comma)" />
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

export default UpdateSkills;