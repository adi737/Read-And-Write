import UpdateArticle from 'components/forms/UpdateArticle';
import api from 'helpers/api';
import React, { useState } from 'react'
import { ListGroup, Button, Spinner } from 'react-bootstrap';
import { useMutation, useQueryClient } from 'react-query';
import FileDelete from './FileDelete';
import FileUpload from './FileUpload';

interface MyArticleProps {
  id: string;
  topic: string;
  picture: any[];
}

export const MyArticle: React.FC<MyArticleProps> = ({ id, topic, picture }) => {
  const [showUpdateArticle, setShowUpdateArticle] = useState(false);
  const queryClient = useQueryClient();

  const deleteArticle = async (id: string) => {
    const res = await api.delete(`/article/${id}`);
    const data = await res.data;
    return data;
  }

  const { mutate, isLoading: loading } = useMutation((id: string) => deleteArticle(id), {
    onSuccess(newArticle) {
      const articlesCache = queryClient.getQueryData('articles');

      if (articlesCache) {
        queryClient.setQueryData('articles', (articles: any) =>
          articles.filter(article => article._id !== newArticle._id));
      }

      queryClient.setQueryData('myArticles', (articles: any) =>
        articles.filter(article => article._id !== newArticle._id));


      queryClient.removeQueries(['article', id]);
    }
  })

  return (
    <ListGroup.Item className='position-relative pt-3'>
      <span
        className='h5 link'
        onClick={() => setShowUpdateArticle(true)}
      >
        {topic}
        {` `}<i className="far fa-edit"></i>
      </span>
      {
        showUpdateArticle ?
          <UpdateArticle
            id={id}
            show={showUpdateArticle}
            onHide={() => setShowUpdateArticle(false)}
          /> : null
      }
      {
        picture.length === 0 ?
          <>
            <small className='mt-1 d-block'>Add file</small>
            <FileUpload id={id} />
          </>
          :
          <FileDelete articleId={id} pictureId={picture[0]._id} imgName={picture[0].imgName} />
      }
      {
        loading ?
          <Button
            variant='custom'
            className='position-absolute'
            size='sm'
            disabled>
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
            onClick={() => {
              if (window.confirm('Are you sure you want to delete the article?'))
                mutate(id)
            }}
            variant='custom'
            className='position-absolute'
            size='sm'
          >
            <i className="far fa-trash-alt"></i> Delete
        </Button>
      }
    </ListGroup.Item>
  );
}