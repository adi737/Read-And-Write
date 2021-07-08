import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getArticleById, cleanArticleState, updateArticle } from 'actions/article.action';
import Loader from 'helpers/Loader';
import { v4 as uuidv4 } from 'uuid';
import { Button, Container, Form, Spinner } from 'react-bootstrap';
import { ArticleFormState, State } from 'interfaces';

interface UpdateArticleProps {
  match: {
    params: {
      id: string;
    }
  }
  history: {
    push: Function;
  }
}

const UpdateArticle: React.FC<UpdateArticleProps> = ({ match: { params: { id } }, history: { push } }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ArticleFormState>({});

  const article = useSelector((state: State) => state.article.article);
  const stateLoading = useSelector((state: State) => state.article.article.loading);

  const { topic, intro, description } = article

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getArticleById(id, push))
    return () => {
      dispatch(cleanArticleState());
    }
  }, [dispatch, id, push])

  useEffect(() => {
    setFormData({
      topic,
      intro,
      description
    })
  }, [topic, intro, description])

  const handleOnChange = useCallback(e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }, [formData]);


  const handleOnSubmit = useCallback(e => {
    e.preventDefault();
    setLoading(true);

    const uuid = uuidv4();
    dispatch(updateArticle(id, formData, push, uuid, setLoading));
  }, [dispatch, id, formData, push]);

  return stateLoading ?
    <Loader />
    :
    formData.topic !== undefined ?
      <Container className='my-3'>
        <Form onSubmit={handleOnSubmit}>
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
          </Form.Group>
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
                Update article
              </Button>
          }
        </Form>
      </Container>
      :
      null
}

export default UpdateArticle;