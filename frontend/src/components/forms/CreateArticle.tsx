import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createArticle } from 'actions/article.action';
import { v4 as uuidv4 } from 'uuid';
import { Button, Container, Form, Spinner } from 'react-bootstrap';
import { ArticleFormState } from 'interfaces';

interface CreateArticleProps {
  history: {
    push: Function;
  }
}

const CreateArticle: React.FC<CreateArticleProps> = ({ history: { push } }) => {
  const [formData, setFormData] = useState<ArticleFormState>({});
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleOnChange = useCallback(e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }, [formData]);


  const handleOnSubmit = useCallback(e => {
    e.preventDefault();

    const id = uuidv4();
    setLoading(true);
    dispatch(createArticle(formData, push, id, setLoading));
  }, [dispatch, formData, push]);

  return (
    <Container className='my-3'>
      <Form onSubmit={handleOnSubmit}>
        <Form.Group controlId="formBasicTopic">
          <Form.Label>Topic</Form.Label>
          <Form.Control
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
              Add article
            </Button>
        }
      </Form>
    </Container>
  );
}

export default CreateArticle;