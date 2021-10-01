import { State } from 'interfaces';
import React from 'react'
import { Col, Image, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';

interface ConversationProps {
  conversationId: string;
  setConversationId: React.Dispatch<React.SetStateAction<string>>;
  setIsChatting: React.Dispatch<React.SetStateAction<boolean>>;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  members: any[];
}

export const Conversation: React.FC<ConversationProps> =
  ({ conversationId, setConversationId, setIsChatting, setUserId, members }) => {
    const userID = useSelector((state: State) => state.user.userID);
    const avatar = useSelector((state: State) => state.user.avatar);
    const member = members.filter(member => member._id !== userID)[0];
    const memberId = member?._id;
    const onlineUsers = useSelector((state: State) => state.onlineUsers);
    const isOnline = onlineUsers.some((user: any) => user.userId === memberId);

    const handleOnClick = () => {
      setConversationId(conversationId);
      setUserId(memberId);
      setIsChatting(true);
    }
    return (
      <Row
        onClick={handleOnClick}
        className='align-items-center m-0 conversation'
      >
        <Col className='flex-grow-0 my-1'>
          <div className="img">
            <Image
              width={50}
              height={50}
              src={member ? member.avatar : avatar}
              roundedCircle
              alt="avatar"
            />
            <div className={isOnline ? 'green' : 'red'}></div>
          </div>
        </Col>
        <Col className='p-0 ml-3'>
          <p className='m-0'>{member ? member.nick : 'me'}</p>
        </Col>
      </Row>
    );
  }