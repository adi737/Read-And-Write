import api from 'helpers/api';
import { toErrorMap } from 'helpers/toErrorMap';
import { SkillsFormState } from 'interfaces';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal, ModalProps, Spinner } from 'react-bootstrap';
import { useMutation, useQueryClient } from 'react-query';

const UpdateSkills = (props: ModalProps) => {
  const [formData, setFormData] = useState<SkillsFormState>({});
  const [error, setError] = useState<any>(null);
  const queryClient = useQueryClient();
  const myProfile: any = queryClient.getQueryData('myProfile');

  const updateProfile = async () => {
    const { data } = await api.patch('/profile', formData);
    return data;
  }

  const { mutate, isLoading } = useMutation(updateProfile, {
    onSuccess(updatedProfile) {
      const profileCache = queryClient.getQueryData(['profile', updatedProfile._id]);

      if (profileCache) {
        queryClient.setQueryData(['profile', updatedProfile._id], updatedProfile);
      }

      queryClient.setQueryData('myProfile', updatedProfile);
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

  useEffect(() => {
    setFormData({
      skills: myProfile.skills ? myProfile.skills.map(skill => ` ${skill}`) : ''
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
              placeholder="Your skills (split by comma)"
            />
            {
              error?.skills ? <Alert className="mt-2" variant='danger'>{error.skills}</Alert> : null
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

export default UpdateSkills;