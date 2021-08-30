import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Loader from 'helpers/Loader';
import { Button, Container, Form, Media, Spinner, Image, Alert } from 'react-bootstrap';
import { State } from 'interfaces';
import Comment from 'components/utils/Comment';
import Like from 'components/utils/Like';
import Moment from 'react-moment';
import api from 'helpers/api';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toErrorMap } from 'helpers/toErrorMap';
import NotFound from './NotFound';

interface ArticleProps {
  match: {
    params: {
      id: string;
    }
  },
  history: {
    push: Function;
  }
}

const Article: React.FC<ArticleProps> = ({ match: { params: { id } }, history: { push } }) => {
  const [text, setText] = useState({ text: '' });
  const [error, setError] = useState<any>(null);
  const queryClient = useQueryClient();
  const isLogged = useSelector((state: State) => state.user.isLogged);

  const getArticleById = async (id: string) => {
    const { data } = await api.get(`/article/${id}`);
    return data;
  }

  const { isLoading, data: article } = useQuery(['article', id], () => getArticleById(id));

  const commentArticle = async () => {
    const { data } = await api.post(`/article/comment/${id}`, text);
    return data;
  }

  const { mutate, isLoading: loading } = useMutation(commentArticle, {
    onSuccess(updatedArticle) {
      setError(null);
      setText({ text: '' });
      queryClient.setQueryData(['article', id], updatedArticle);
    },
    onError(err: any) {
      setError(toErrorMap(err.response.data.errors));
    }
  })

  const handleAddComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate();
  }

  return isLoading ?
    <Loader />
    : !article ?
      <NotFound />
      :
      <Container>
        <section className='mt-3'>
          <article>
            <h2 className='text-center mb-3'>{article.topic}</h2>
            {
              isLogged ?
                <Like likes={article.likes} dislikes={article.dislikes} />
                :
                <div className='d-flex justify-content-center mb-3 text-white text-center'>
                  <div
                    style={{ width: '60px', fontSize: '20px' }}
                    className='bg-success p-2 mr-1 rounded user-select-none'
                  >
                    <p className='m-0'>{article.likes ? article.likes.length : ''}</p>
                    <i className="far fa-thumbs-up"></i>
                  </div>
                  <div
                    style={{ width: '60px', fontSize: '20px' }}
                    className='bg-danger p-2 ml-1 rounded user-select-none'
                  >
                    <p className='m-0'>{article.dislikes ? article.dislikes.length : ''}</p>
                    <i className="far fa-thumbs-down"></i>
                  </div>
                </div>
            }
            {
              !article.picture ? null : article.picture.length === 0 ? null
                :
                <img src={article.picture[0].imgUrl} alt="atricle" className='w-100 mb-3' />
            }
          </article>
          <article className='mb-3'>
            <h5>{article.intro}</h5>
            <p className='text-justify mb-5'>{article.description}</p>
          </article>
          {
            isLogged ?
              <article className='mb-3 mt-5'>
                <Form onSubmit={handleAddComment}>
                  <Form.Control
                    required
                    className='mb-1'
                    as="textarea"
                    rows={5}
                    onChange={e => setText({ text: e.target.value })}
                    placeholder='Your comment...'
                    value={text.text}
                  />
                  {
                    error?.text ? <Alert className="mt-2" variant='danger'>{error.text}</Alert> : null
                  }
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
                      <Button variant="primary" type="submit">
                        Add comment
                    </Button>
                  }
                </Form>
              </article>
              :
              null
          }
          {
            article.comments && article.comments.length !== 0 ?
              article.comments.map(comment =>
                isLogged ?
                  <Comment key={comment._id} comment={comment} />
                  :
                  <article key={comment._id} className='border my-4 position-relative'>
                    <Media className='p-3'>
                      <div className='mr-3 text-center'>
                        <Image
                          rounded
                          width={50}
                          height={50}
                          src={
                            comment.userID ? comment.userID.avatar
                              :
                              '/img/avatar.svg'
                          }
                          alt="avatar"
                        />
                        <small className='text-muted d-block'>{
                          comment.userID ? comment.userID.nick
                            :
                            'Deleted'
                        }</small>
                      </div>
                      <Media.Body>
                        <p>{comment.text}</p>
                      </Media.Body>
                    </Media>
                    <footer className='bg-light text-right d-flex justify-content-around align-items-center'>
                      <small className='d-block mr-1 font-italic'>
                        Commented on {' '}
                        <Moment format="DD.MM.YYYY HH:mm:ss">
                          {comment.date}
                        </Moment>
                      </small>
                      <div key={comment._id} className='d-flex text-center text-white'>
                        <div
                          className='bg-success mr-1 px-2 user-select-none'
                        >
                          <p className='m-0 '>{comment.likes.length}</p>
                          <i className="far fa-thumbs-up"></i>
                        </div>
                        <div
                          className='bg-danger px-2 user-select-none'
                        >
                          <p className='m-0'>{comment.dislikes.length}</p>
                          <i className="far fa-thumbs-down"></i>
                        </div>
                      </div>
                    </footer>
                  </article>
              )
              :
              null
          }
        </section>
      </Container>
}

export default Article;