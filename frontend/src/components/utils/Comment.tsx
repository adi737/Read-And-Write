import api from 'helpers/api';
import { State } from 'interfaces';
import React, { useEffect, useRef } from 'react'
import { Button, Media, Image, Spinner } from 'react-bootstrap';
import Moment from 'react-moment';
import { useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

interface CommentProps {
  comment: {
    _id: string;
    likes: {
      _id: string;
      userID: string;
    }[];
    dislikes: {
      _id: string;
      userID: string;
    }[];
    date: string;
    userID: {
      _id: string;
      avatar: string;
      nick: string;
    };
    text: string;
  }
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const userID = useSelector((state: State) => state.user.userID);
  const { id } = useParams<{ id: string }>();
  const likeRef = useRef<HTMLButtonElement>(null);
  const dislikeRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const likes = comment.likes;

    if (likes.length !== 0) {
      const isLiked = likes.some(like => like.userID === userID);

      isLiked ?
        likeRef.current!.classList.add('bg-success')
        :
        likeRef.current!.classList.remove('bg-success')
    } else {
      likeRef.current!.classList.remove('bg-success');
    }

  }, [comment.likes, userID]);

  useEffect(() => {
    const dislikes = comment.dislikes;

    if (dislikes.length !== 0) {
      const isDisliked = dislikes.some(dislike => dislike.userID === userID);

      isDisliked ?
        dislikeRef.current!.classList.add('bg-danger')
        :
        dislikeRef.current!.classList.remove('bg-danger')
    } else {
      dislikeRef.current!.classList.remove('bg-danger');
    }

  }, [comment.dislikes, userID]);

  const removeCommentFromArticle = async (articleId: string, commentId: string) => {
    const { data } = await api.delete(`/article/comment/${articleId}/${commentId}`);
    return data;
  }

  const { mutate: removeComment, isLoading: removeCommentLoading } = useMutation(() => removeCommentFromArticle(id, comment._id), {
    onSuccess(updatedArticle) {
      queryClient.setQueryData(['article', id], updatedArticle);
    }
  });

  const handleRemoveComment = () => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      removeComment()
    }
  }

  const likeComment = async (articleId: string, commentId: string) => {
    const { data } = await api.post(`/article/comment/like/${articleId}/${commentId}`);
    return data;
  }

  const { mutate: like, isLoading: likeCommentLoading } = useMutation(() => likeComment(id, comment._id), {
    onSuccess(updatedArticle) {
      queryClient.setQueryData(['article', id], updatedArticle);
    }
  });

  const dislikeComment = async (articleId: string, commentId: string) => {
    const { data } = await api.post(`/article/comment/dislike/${articleId}/${commentId}`);
    return data;
  }

  const { mutate: dislike, isLoading: dislikeCommentLoading } = useMutation(() => dislikeComment(id, comment._id), {
    onSuccess(updatedArticle) {
      queryClient.setQueryData(['article', id], updatedArticle);
    }
  });

  return (
    <article className='border my-4 position-relative'>
      {
        comment.userID?._id === userID ?
          removeCommentLoading ?
            <Button variant="custom" className='position-absolute' size='sm' disabled>
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              /> loading...
            </Button>
            :
            <Button variant='custom' className='position-absolute' size='sm' onClick={handleRemoveComment}>
              <i className="far fa-trash-alt"></i> Delete
            </Button>
          :
          null
      }
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
        <div className='d-flex text-center text-white'>
          {
            likeCommentLoading ?
              <Button className='bg-secondary mr-1 px-2 user-select-none' ref={likeRef} disabled>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              </Button>
              :
              <Button
                ref={likeRef}
                onClick={() => like()}
                className='bg-secondary mr-1 px-2 user-select-none'
              >
                <p className='m-0 '>{comment.likes.length}</p>
                <i className="far fa-thumbs-up"></i>
              </Button>
          }
          {
            dislikeCommentLoading ?
              <Button className='bg-secondary px-2 user-select-none' ref={dislikeRef} disabled>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              </Button>
              :
              <Button
                ref={dislikeRef}
                onClick={() => dislike()}
                className='bg-secondary px-2 user-select-none'
              >
                <p className='m-0'>{comment.dislikes.length}</p>
                <i className="far fa-thumbs-down"></i>
              </Button>

          }
        </div>
      </footer>
    </article>
  );
}

export default Comment;