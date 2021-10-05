import api from 'helpers/api';
import { State } from 'interfaces';
import React from 'react'
import { Col, Image } from 'react-bootstrap';
import { useSelector } from 'react-redux';

interface OnlineUserProps {
  userId: string;
  nick: string;
  avatar: string;
  setIsChatting: React.Dispatch<React.SetStateAction<boolean>>;
  setConversationId: React.Dispatch<React.SetStateAction<string>>;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
}

export const OnlineUser: React.FC<OnlineUserProps> =
  ({ userId, nick, avatar, setIsChatting, setConversationId, setUserId }) => {
    const myId = useSelector((state: State) => state.user.userID);

    const handleOnClick = async () => {
      try {
        const { data: conversation } = await api.get(`/messenger/${userId}`);
        if (conversation?._id) {
          setConversationId(conversation._id);
        }
        setUserId(userId);
        setIsChatting(true);
      } catch (error) {
        console.error(error);
      }
    }

    return myId !== userId ?
      <Col
        onClick={handleOnClick}
        className='flex-grow-0 mt-3'
      >
        <div className="user-icon">
          <div className='img d-inline-block'>
            <Image
              width={50}
              height={50}
              roundedCircle src={avatar}
              alt="avatar"
            />
            <div className='green'></div>
          </div>
          <p className='m-0 text-center'>{nick}</p>
        </div>
      </Col > : null
  }