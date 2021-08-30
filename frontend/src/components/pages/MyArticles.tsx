import React, { useState } from 'react';
import Loader from 'helpers/Loader';
import { Button, Col, Container, ListGroup, Row } from 'react-bootstrap';
import api from 'helpers/api';
import { useQuery } from 'react-query';
import CreateArticle from 'components/forms/CreateArticle';
import { MyArticle } from 'components/utils/MyArticle';


const MyArticles = () => {
  const [showCreateArticle, setShowCreateArticle] = useState(false);

  const getArticles = async () => {
    const res = await api.get('/article');
    const data = await res.data;
    return data;
  }

  const { data: articles, isLoading } = useQuery('myArticles', getArticles, {
    staleTime: Infinity,
    cacheTime: Infinity
  });

  return isLoading ?
    <Loader />
    :
    articles.length === 0 ?
      <>
        <p className='text-center mt-4 display-4'>No article has been added</p>
        <Button
          onClick={() => setShowCreateArticle(true)}
          className="d-block mx-auto my-3"
        >
          Create article
        </Button>
        {
          showCreateArticle ?
            <CreateArticle
              show={showCreateArticle}
              onHide={() => setShowCreateArticle(false)}
            />
            : null
        }
        <CreateArticle
          show={showCreateArticle}
          onHide={() => setShowCreateArticle(false)}
        />
      </>
      :
      <Container className='my-3'>
        <Row>
          <Col md={{ span: 8, offset: 2 }}>
            <Button
              size='lg'
              className="d-block mx-auto my-2"
              onClick={() => setShowCreateArticle(true)}
            >
              Create article
            </Button>
            {
              showCreateArticle ?
                <CreateArticle
                  show={showCreateArticle}
                  onHide={() => setShowCreateArticle(false)}
                />
                : null
            }
            <ListGroup >
              {
                articles.map(({ _id: id, topic, picture }) =>
                  <MyArticle
                    key={id}
                    id={id}
                    topic={topic}
                    picture={picture}
                  />)
              }
            </ListGroup>
          </Col>
        </Row>
      </Container >
}

export default MyArticles;