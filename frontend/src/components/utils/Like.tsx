import { dislikeArticle, likeArticle } from 'actions/article.action';
import { State } from 'interfaces';
import React, { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
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
  const likeRef = useRef<HTMLDivElement>(null);
  const dislikeRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const userID = useSelector((state: State) => state.user.userID);

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


  const like = useCallback(() => {
    dispatch(likeArticle(id));
  }, [dispatch, id]);

  const dislike = useCallback(() => {
    dispatch(dislikeArticle(id));
  }, [dispatch, id]);

  return (
    <div className='d-flex justify-content-center mb-3 text-white text-center' >
      <div
        ref={likeRef}
        style={{ width: '60px', fontSize: '20px' }}
        className='bg-secondary like p-2 mr-1 rounded user-select-none'
        onClick={like}
      >
        <p className='m-0'>{likes ? likes.length : ''}</p>
        <i className="far fa-thumbs-up"></i>
      </div>
      <div
        ref={dislikeRef}
        style={{ width: '60px', fontSize: '20px' }}
        className='bg-secondary dislike p-2 ml-1 rounded user-select-none'
        onClick={dislike}
      >
        <p className='m-0'>{dislikes ? dislikes.length : ''}</p>
        <i className="far fa-thumbs-down"></i>
      </div>
    </div >
  );
}

export default Like;