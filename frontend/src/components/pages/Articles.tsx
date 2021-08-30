import React from 'react';
import ArticleIcon from 'components/utils/ArticleIcon';
import Loader from 'helpers/Loader';
import { Col, Container, Row } from 'react-bootstrap';
import { useQuery } from 'react-query';
import api from 'helpers/api';

const Articles = () => {
  const getArticles = async () => {
    const res = await api.get('/article/articles');
    const data = await res.data;
    return data;
  }

  const { data: articles, isLoading } = useQuery('articles', getArticles);

  return (
    isLoading ?
      <Loader />
      :
      articles.length === 0 ?
        <p className='text-center mt-4 display-4'>No article has been added</p>
        :
        <Container>
          <section className='mt-3'>
            <Row xs={1} sm={2} lg={3} xl={4}>
              {
                articles.map(article =>
                  <Col key={article._id}>
                    <ArticleIcon article={article} />
                  </Col>
                )
              }
            </Row>
          </section>
        </Container>
  );
}


export default Articles;