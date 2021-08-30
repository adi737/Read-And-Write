import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal, ModalProps, Spinner } from 'react-bootstrap';
import { ArticleFormState } from 'interfaces';
import { useMutation, useQueryClient } from 'react-query';
import api from 'helpers/api';
import { toErrorMap } from 'helpers/toErrorMap';


const UpdateArticle = (props: ModalProps) => {
  const [error, setError] = useState<any>(null);
  const [formData, setFormData] = useState<ArticleFormState>({
    topic: '',
    intro: '',
    description: ''
  });
  const queryClient = useQueryClient();
  const myArticles: any = queryClient.getQueryData('myArticles');
  const article = myArticles.find(article => article._id === props.id);

  useEffect(() => {
    setFormData({
      topic: article.topic,
      intro: article.intro,
      description: article.description
    })
  }, [article]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const updateArticle = async () => {
    const res = await api.put(`/article/${props.id}`, formData);
    const data = await res.data;
    return data;
  }

  const { mutate, isLoading: loading } = useMutation(updateArticle, {
    onSuccess(updatedArticle) {
      const articlesCache = queryClient.getQueryData('articles');
      const articleCache = queryClient.getQueryData(['article', props.id]);

      if (articlesCache) {
        queryClient.setQueryData('articles', (articles: any) =>
          articles.map(article => article._id === props.id ? updatedArticle : article));
      }

      if (articleCache) {
        queryClient.setQueryData(['article', props.id], updatedArticle);
      }

      queryClient.setQueryData('myArticles', (articles: any) =>
        articles.map(article => article._id === props.id ? updatedArticle : article));

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
          Update article
          </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleOnSubmit}>
        <Modal.Body>
          <Form.Group controlId="formBasicTopic">
            <Form.Label>Topic</Form.Label>
            <Form.Control
              value={formData.topic}
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
              value={formData.intro}
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
              value={formData.description}
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
            loading ?
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
                Update article
              </Button>
          }
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default UpdateArticle;