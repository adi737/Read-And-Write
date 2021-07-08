import { dislikeArticleComment, likeArticleComment, removeCommentFromArticle } from 'actions/article.action';
import { State } from 'interfaces';
import React, { useCallback, useEffect, useRef } from 'react'
import { Button, Media, Image } from 'react-bootstrap';
import Moment from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

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
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const likeRef = useRef<HTMLDivElement>(null);
  const dislikeRef = useRef<HTMLDivElement>(null);

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

  const handleRemoveComment = useCallback((commentId) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      const uuid = uuidv4();
      dispatch(removeCommentFromArticle(id, commentId, uuid));
    }
  }, [dispatch, id]);

  const likeComment = useCallback((commentId) => {
    dispatch(likeArticleComment(id, commentId));
  }, [dispatch, id]);


  const dislikeComment = useCallback((commentId) => {
    dispatch(dislikeArticleComment(id, commentId));
  }, [dispatch, id]);

  return (
    <article className='border my-4 position-relative'>
      {
        comment.userID?._id === userID ?
          <Button variant='custom' className='position-absolute' size='sm' onClick={() => handleRemoveComment(comment._id)}>
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
          <div
            ref={likeRef}
            onClick={() => likeComment(comment._id)}
            className='bg-secondary mr-1 px-2 like user-select-none'
          >
            <p className='m-0 '>{comment.likes.length}</p>
            <i className="far fa-thumbs-up"></i>
          </div>
          <div
            ref={dislikeRef}
            onClick={() => dislikeComment(comment._id)}
            className='bg-secondary px-2 dislike user-select-none'
          >
            <p className='m-0'>{comment.dislikes.length}</p>
            <i className="far fa-thumbs-down"></i>
          </div>
        </div>
      </footer>
    </article>
  );
}

export default Comment;