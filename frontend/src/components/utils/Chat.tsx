import { AddMessage } from 'components/forms/AddMessage';
import api from 'helpers/api';
import Loader from 'helpers/Loader';
import { socket } from 'index';
import React, { useEffect, useRef } from 'react'
import { Row } from 'react-bootstrap';
import { useQuery, useQueryClient } from 'react-query';
import { Message } from './Message';

interface ChatProps {
  memberId: string;
  conversationId: string;
  setIsChatting: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Chat: React.FC<ChatProps> =
  ({ memberId, conversationId, setIsChatting }) => {
    const randomId = '000000000000000000000000'
    const { data: messages, isLoading } = useQuery(['messages', conversationId], async () => {
      const { data } = await api.get(`/messenger/messages/${conversationId ?
        conversationId : randomId}`);
      return data;
    });
    const divRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
      if (divRef.current) {
        divRef.current.scrollIntoView();
      }
    }, [messages]);

    useEffect(() => {
      const messagesCache =
        queryClient.getQueriesData(["messages", conversationId]);

      const listener = (message) => {
        queryClient.setQueryData(["messages", conversationId],
          (messages: any) => [...messages, message])
      }

      if (messagesCache) {
        socket.on('getMessage', listener);
      }

      return () => {
        socket.off('getMessage', listener)
      }
    }, [conversationId, queryClient]);

    return (
      <>
        <Row className='m-0 mt-2 ml-2' onClick={() => setIsChatting(false)}>
          <i className="fas fa-chevron-left"></i>
        </Row >
        {
          isLoading ? <Loader /> :
            <>
              <Row className='m-0 flex-column messages'>
                {
                  messages.map(message =>
                    <Message key={message._id} message={message} />
                  )
                }
              </Row>
              <Row className='m-0 write-message'>
                <AddMessage
                  memberId={memberId}
                  conversationId={conversationId}
                />
              </Row>
            </>
        }
        <div ref={divRef}></div>
      </>
    )

  }