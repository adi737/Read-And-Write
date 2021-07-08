import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { deletePictureFromArticle } from 'actions/article.action';
import { Button } from 'react-bootstrap';

interface FileDeleteProps {
  articleId: string;
  pictureId: string;
  imgName: string;
}

const FileDelete: React.FC<FileDeleteProps> = ({ articleId, pictureId, imgName }) => {
  const dispatch = useDispatch();

  const deleteFile = useCallback(() => {
    if (window.confirm('Are you sure you want to delete the picture?'))
      dispatch(deletePictureFromArticle(articleId, pictureId, imgName));

  }, [dispatch, articleId, pictureId, imgName]);

  return (
    <div className='delete-picture'>
      <Button
        onClick={deleteFile}
        size='sm'
        variant='my'
      >
        Delete picture <i className="far fa-trash-alt"></i>
      </Button>
    </div>
  );
}

export default FileDelete;