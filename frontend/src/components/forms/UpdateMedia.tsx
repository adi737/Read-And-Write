import { updateProfile } from 'actions/profile.action';
import { MediaFormState, State } from 'interfaces';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, Modal, ModalProps, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

const UpdateMedia = (props: ModalProps) => {
  const [formData, setFormData] = useState<MediaFormState>({});
  const [loading, setLoading] = useState(false);

  const linkedin = useSelector((state: State) => state.profile.profile.linkedin);
  const facebook = useSelector((state: State) => state.profile.profile.facebook);
  const instagram = useSelector((state: State) => state.profile.profile.instagram);
  const youtube = useSelector((state: State) => state.profile.profile.youtube);
  const twitter = useSelector((state: State) => state.profile.profile.twitter);

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
    setFormData({
      linkedin,
      facebook,
      instagram,
      youtube,
      twitter
    });
  }, [linkedin, facebook, instagram, youtube, twitter]);

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
              placeholder="LinkedIn link" />
          </Form.Group>
          <Form.Group controlId="formBasicFacebook">
            <Form.Label>Facebook</Form.Label>
            <Form.Control
              value={formData.facebook ?? ''}
              name='facebook'
              onChange={handleOnChange}
              type="text"
              placeholder="Facebook link" />
          </Form.Group>
          <Form.Group controlId="formBasicInstagram">
            <Form.Label>Instagram</Form.Label>
            <Form.Control
              value={formData.instagram ?? ''}
              name='instagram'
              onChange={handleOnChange}
              type="text"
              placeholder="Instagram link" />
          </Form.Group>
          <Form.Group controlId="formBasicYoutube">
            <Form.Label>Youtube</Form.Label>
            <Form.Control
              value={formData.youtube ?? ''}
              name='youtube'
              onChange={handleOnChange}
              type="text"
              placeholder="Youtube link" />
          </Form.Group>
          <Form.Group controlId="formBasicTwitter">
            <Form.Label>Twitter</Form.Label>
            <Form.Control
              value={formData.twitter ?? ''}
              name='twitter'
              onChange={handleOnChange}
              type="text"
              placeholder="Twitter link" />
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

export default UpdateMedia;