import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { State } from 'interfaces';
import { Row } from 'react-bootstrap';
import { OnlineUser } from 'components/utils/OnlineUser';
import { useQuery } from 'react-query';
import api from 'helpers/api';
import { Conversation } from 'components/utils/Conversation';
import Loader from 'helpers/Loader';
import { Chat } from 'components/utils/Chat';


const Messenger = () => {
  const onlineUsers = useSelector((state: State) => state.onlineUsers);
  const [isChatting, setIsChatting] = useState(false);
  const [conversationId, setConversationId] = useState('');
  const [userId, setUserId] = useState('');
  const { data: conversations, isLoading } = useQuery('conversations',
    async () => {
      const { data } = await api.get('/messenger');
      return data;
    });

  return (
    <article className='messenger-container'>
      <section className='users'>
        <Row className='m-0 user-icons'>
          {
            onlineUsers.length < 2 ?
              <h5 className='mt-2 mx-auto text-center'>No online users</h5> :
              onlineUsers.map(
                ({ userId, nick, avatar }) =>
                  <OnlineUser
                    key={userId}
                    userId={userId}
                    nick={nick}
                    avatar={avatar}
                    setIsChatting={setIsChatting}
                    setConversationId={setConversationId}
                    setUserId={setUserId}
                  />
              )
          }
        </Row>
      </section>
      <section className='conversations'>
        {
          isLoading ? <Loader /> : conversations.length === 0 ?
            <h5 className='text-center'>No conversation yet</h5> :
            conversations.map(({ _id, members }) =>
              <Conversation
                key={_id}
                conversationId={_id}
                setConversationId={setConversationId}
                setIsChatting={setIsChatting}
                members={members}
                setUserId={setUserId}
              />)
        }
      </section>
      {
        isChatting ?
          <section className='chat'>
            <Chat
              conversationId={conversationId}
              memberId={userId}
              setIsChatting={setIsChatting}
            />
          </section> : <div className='empty'></div>
      }
    </article>
  )

}

export default Messenger