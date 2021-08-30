import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useMutation, useQueryClient } from 'react-query';
import { storage } from 'firebaseSet';
import api from 'helpers/api';

interface FileDeleteProps {
  articleId: string;
  pictureId: string;
  imgName: string;
}

const FileDelete: React.FC<FileDeleteProps> = ({ articleId, pictureId, imgName }) => {
  const queryClient = useQueryClient();

  const deleteFile = async () => {
    if (window.confirm('Are you sure you want to delete the picture?')) {
      const { data } = await api.delete(`/article/upload/${articleId}/${pictureId}`);
      const imgRef = storage.ref('images').child(imgName);
      await imgRef.delete();
      return data;
    }
  }

  const { mutate, isLoading } = useMutation(deleteFile, {
    onSuccess(updatedArticle) {
      const articlesCache = queryClient.getQueryData('articles');

      if (articlesCache) {
        queryClient.setQueryData('articles', (articles: any) =>
          articles.map(article => article._id === updatedArticle._id ? updatedArticle : article));
      }

      queryClient.setQueryData('myArticles', (articles: any) =>
        articles.map(article => article._id === updatedArticle._id ? updatedArticle : article));
    }
  });

  return (
    <div className='delete-picture'>
      {
        isLoading ?
          <Button
            disabled
            size='sm'
            variant='my'
          >
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
            onClick={mutate as any}
            size='sm'
            variant='my'
          >
            Delete picture <i className="far fa-trash-alt"></i>
          </Button>
      }
    </div>
  );
}

export default FileDelete;