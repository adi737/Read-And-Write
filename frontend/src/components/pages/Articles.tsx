import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getArticles, cleanArticleState } from 'actions/article.action';
import ArticleIcon from 'components/utils/ArticleIcon';
import Loader from 'helpers/Loader';
import { Col, Container, Row } from 'react-bootstrap';
import { State } from 'interfaces';

const Articles = () => {
  const articles = useSelector((state: State) => state.article.articles);
  const loading = useSelector((state: State) => state.article.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getArticles());

    return () => {
      dispatch(cleanArticleState());
    }
  }, [dispatch])

  return (
    loading ?
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