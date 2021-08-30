import api from 'helpers/api';
import { State } from 'interfaces';
import React, { useEffect, useRef } from 'react'
import { Button, Spinner } from 'react-bootstrap';
import { useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

interface LikeProps {
  likes: {
    _id: string;
    userID: string;
  }[]
  dislikes: {
    _id: string;
    userID: string;
  }[]
}

const Like: React.FC<LikeProps> = ({ likes, dislikes }) => {
  const likeRef = useRef<HTMLButtonElement>(null);
  const dislikeRef = useRef<HTMLButtonElement>(null);
  const { id } = useParams<{ id: string }>();
  const userID = useSelector((state: State) => state.user.userID);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (likes.length !== 0) {
      const isLiked = likes.some(like => like.userID === userID);

      isLiked ?
        likeRef.current!.classList.add('bg-success')
        :
        likeRef.current!.classList.remove('bg-success')
    } else {
      likeRef.current!.classList.remove('bg-success');
    }
  }, [likes, userID]);


  useEffect(() => {
    if (dislikes.length !== 0) {
      const isDisliked = dislikes.some(dislike => dislike.userID === userID);

      isDisliked ?
        dislikeRef.current!.classList.add('bg-danger')
        :
        dislikeRef.current!.classList.remove('bg-danger')
    } else {
      dislikeRef.current!.classList.remove('bg-danger');
    }
  }, [dislikes, userID]);


  const likeArticle = async () => {
    const { data } = await api.post(`/article/like/${id}`);
    return data;
  }

  const { mutate: like, isLoading: likeArticleLoading } = useMutation(likeArticle, {
    onSuccess(updatedArticle) {
      queryClient.setQueryData(['article', id], updatedArticle);
    }
  })

  const dislikeArticle = async () => {
    const { data } = await api.post(`/article/dislike/${id}`);
    return data;
  }

  const { mutate: dislike, isLoading: dislikeArticleLoading } = useMutation(dislikeArticle, {
    onSuccess(updatedArticle) {
      queryClient.setQueryData(['article', id], updatedArticle);
    }
  })

  return (
    <div className='d-flex justify-content-center mb-3 text-white text-center' >
      {
        likeArticleLoading ?
          <Button
            ref={likeRef}
            style={{ width: '60px', fontSize: '20px' }}
            className='bg-secondary p-2 mr-1 rounded user-select-none'
            disabled
          >
            <Spinner
              as="span"
              animation="grow"
              role="status"
              aria-hidden="true"
            />
          </Button>
          :
          <Button
            ref={likeRef}
            style={{ width: '60px', fontSize: '20px' }}
            className='bg-secondary p-2 mr-1 rounded user-select-none'
            onClick={() => like()}
          >
            <p className='m-0'>{likes ? likes.length : ''}</p>
            <i className="far fa-thumbs-up"></i>
          </Button>
      }
      {
        dislikeArticleLoading ?
          <Button
            ref={dislikeRef}
            style={{ width: '60px', fontSize: '20px' }}
            className='bg-secondary p-2 ml-1 rounded user-select-none'
            disabled
          >
            <Spinner
              as="span"
              animation="grow"
              role="status"
              aria-hidden="true"
            />
          </Button>
          :
          <Button
            ref={dislikeRef}
            style={{ width: '60px', fontSize: '20px' }}
            className='bg-secondary p-2 ml-1 rounded user-select-none'
            onClick={() => dislike()}
          >
            <p className='m-0'>{dislikes ? dislikes.length : ''}</p>
            <i className="far fa-thumbs-down"></i>
          </Button>
      }
    </div >
  );
}

export default Like;