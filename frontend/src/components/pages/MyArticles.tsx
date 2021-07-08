import React, { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getYourArticles, cleanArticleState, deleteArticle } from 'actions/article.action';
import Loader from 'helpers/Loader';
import FileUpload from 'components/utils/FileUpload';
import FileDelete from 'components/utils/FileDelete';
import { Button, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { State } from 'interfaces';



const MyArticles = () => {
  const articles = useSelector((state: State) => state.article.articles);
  const loading = useSelector((state: State) => state.article.loading);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getYourArticles());

    return () => {
      dispatch(cleanArticleState());
    }
  }, [dispatch]);


  const handleDeleteArticle = useCallback(id => {
    if (window.confirm('Are you sure you want to delete the article?'))
      dispatch(deleteArticle(id));
  }, [dispatch]);

  return loading ?
    <Loader />
    :
    articles.length === 0 ?
      <>
        <p className='text-center mt-4 display-4'>No article has been added</p>
        <Link className="text-decoration-none" to="createArticle">
          <Button className="d-block mx-auto my-3">Create article</Button>
        </Link>
      </>
      :
      <Container className='my-3'>
        <Row>
          <Col md={{ span: 8, offset: 2 }}>
            <Link className="text-decoration-none" to="createArticle">
              <Button size='lg' className="d-block mx-auto my-2">Create article</Button>
            </Link>
            <ListGroup>
              {
                articles.map(({ _id: id, topic, picture }) =>
                  <ListGroup.Item key={id} className='position-relative pt-3'>
                    <Link className="text-decoration-none" to={`/updateArticle/${id}`}>
                      <span className='h5'>
                        {topic}
                      </span> <i className="far fa-edit"></i>
                    </Link>
                    {
                      picture.length === 0 ?
                        <>
                          <small className='mt-1 d-block'>Add file</small>
                          <FileUpload id={id} />
                        </>
                        :
                        <FileDelete articleId={id} pictureId={picture[0]._id} imgName={picture[0].imgName} />
                    }
                    <Button
                      onClick={() => handleDeleteArticle(id)}
                      variant='custom'
                      className='position-absolute'
                      size='sm'
                    >
                      <i className="far fa-trash-alt"></i> Delete
                </Button>
                  </ListGroup.Item>
                )
              }
            </ListGroup>
          </Col>
        </Row>
      </Container>
}

export default MyArticles;