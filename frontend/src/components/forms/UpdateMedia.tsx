import api from 'helpers/api';
import { toErrorMap } from 'helpers/toErrorMap';
import { MediaFormState } from 'interfaces';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal, ModalProps, Spinner } from 'react-bootstrap';
import { useMutation, useQueryClient } from 'react-query';

const UpdateMedia = (props: ModalProps) => {
  const [formData, setFormData] = useState<MediaFormState>({});
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
      linkedin: myProfile.linkedin ?? '',
      facebook: myProfile.facebook ?? '',
      instagram: myProfile.instagram ?? '',
      youtube: myProfile.youtube ?? '',
      twitter: myProfile.twitter ?? ''
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
          Update Social Media
      </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleOnSubmit}>
        <Modal.Body>
          <Form.Group controlId="formBasicLinkedIn">
            <Form.Label>LinkedIn</Form.Label>
            <Form.Control
              value={formData.linkedin ?? ''}
              name='linkedin'
              onChange={handleOnChange}
              type="text"
              placeholder="LinkedIn link"
            />
            {
              error?.linkedin ? <Alert className="mt-2" variant='danger'>{error.linkedin}</Alert> : null
            }
          </Form.Group>
          <Form.Group controlId="formBasicFacebook">
            <Form.Label>Facebook</Form.Label>
            <Form.Control
              value={formData.facebook ?? ''}
              name='facebook'
              onChange={handleOnChange}
              type="text"
              placeholder="Facebook link"
            />
            {
              error?.facebook ? <Alert className="mt-2" variant='danger'>{error.facebook}</Alert> : null
            }
          </Form.Group>
          <Form.Group controlId="formBasicInstagram">
            <Form.Label>Instagram</Form.Label>
            <Form.Control
              value={formData.instagram ?? ''}
              name='instagram'
              onChange={handleOnChange}
              type="text"
              placeholder="Instagram link"
            />
            {
              error?.instagram ? <Alert className="mt-2" variant='danger'>{error.instagram}</Alert> : null
            }
          </Form.Group>
          <Form.Group controlId="formBasicYoutube">
            <Form.Label>Youtube</Form.Label>
            <Form.Control
              value={formData.youtube ?? ''}
              name='youtube'
              onChange={handleOnChange}
              type="text"
              placeholder="Youtube link"
            />
            {
              error?.youtube ? <Alert className="mt-2" variant='danger'>{error.youtube}</Alert> : null
            }
          </Form.Group>
          <Form.Group controlId="formBasicTwitter">
            <Form.Label>Twitter</Form.Label>
            <Form.Control
              value={formData.twitter ?? ''}
              name='twitter'
              onChange={handleOnChange}
              type="text"
              placeholder="Twitter link"
            />
            {
              error?.twitter ? <Alert className="mt-2" variant='danger'>{error.twitter}</Alert> : null
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

export default UpdateMedia;