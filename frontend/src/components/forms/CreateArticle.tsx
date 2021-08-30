import React, { useState } from 'react';
import { Alert, Button, Form, Modal, ModalProps, Spinner } from 'react-bootstrap';
import { ArticleFormState } from 'interfaces';
import { useMutation, useQueryClient } from 'react-query';
import api from 'helpers/api';
import { toErrorMap } from 'helpers/toErrorMap';


const CreateArticle = (props: ModalProps) => {
  const [formData, setFormData] = useState<ArticleFormState>({});
  const [error, setError] = useState<any>(null);
  const queryClient = useQueryClient();

  const createArticle = async () => {
    const res = await api.post(`/article`, formData);
    const data = await res.data;
    return data;
  }

  const { mutate, isLoading } = useMutation(createArticle, {
    onSuccess(article) {
      const articlesCache = queryClient.getQueryData('articles');

      if (articlesCache) {
        queryClient.setQueryData('articles', (articles: any) => [article, ...articles]);
      }

      queryClient.setQueryData('myArticles', (articles: any) => [article, ...articles]);

      props.onHide();
    },
    onError(err: any) {
      setError(toErrorMap(err.response.data.errors));
    }
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({
    ...formData,
    [e.currentTarget.name]: e.currentTarget.value
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
          Create article
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleOnSubmit}>
        <Modal.Body>
          <Form.Group controlId="formBasicTopic" >
            <Form.Label>Topic</Form.Label>
            <Form.Control
              required
              name='topic'
              onChange={handleOnChange}
              type="text"
              placeholder="Topic of article"
            />
            {
              error?.topic ? <Alert className="mt-2" variant='danger'>{error.topic}</Alert> : null
            }
          </Form.Group>
          <Form.Group controlId="formBasicIntro">
            <Form.Label>Intro</Form.Label>
            <Form.Control
              required
              name='intro'
              onChange={handleOnChange}
              type="text"
              placeholder="Intro of article"
            />
            {
              error?.intro ? <Alert className="mt-2" variant='danger'>{error.intro}</Alert> : null
            }
          </Form.Group>
          <Form.Group controlId="formBasicDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              required
              name='description'
              onChange={handleOnChange}
              type="text"
              placeholder="Description of article"
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
                Add article
              </Button>
          }
        </Modal.Footer>
      </Form>
    </Modal >
  );
}

export default CreateArticle;