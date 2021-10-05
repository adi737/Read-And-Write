import api from 'helpers/api';
import { toErrorMap } from 'helpers/toErrorMap';
import { socket } from 'index';
import React, { useEffect, useState } from 'react'
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useMutation, useQueryClient } from 'react-query';

interface AddMessageProps {
  memberId: string;
  conversationId: string;
}

export const AddMessage: React.FC<AddMessageProps> =
  ({ memberId, conversationId }) => {
    const [error, setError] = useState<any>(null);
    const [formState, setFormState] = useState({ text: '' });
    const queryClient = useQueryClient();

    const addMessage = async () => {
      const { data } = await api.post(`/messenger/${memberId}`, formState);
      return data;
    }

    const { mutate, isLoading: loading } = useMutation(addMessage, {
      onSuccess(message) {
        setError(null);
        setFormState({ text: '' });
        queryClient.setQueryData(['messages', conversationId], (messages: any) =>
          [...messages, message]
        );
        socket.emit('addMessage', { memberId, message });
      },
      onError(err: any) {
        setError(toErrorMap(err.response.data.errors));
      }
    })

    const handleAddMessage = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      mutate();
    }

    useEffect(() => {
      const listener = event => {
        if (event.code === "Enter" || event.code === "NumpadEnter") {
          event.preventDefault();

          mutate();
        }
      };

      document.addEventListener("keydown", listener);
      return () => {
        document.removeEventListener("keydown", listener);
      };
    }, [mutate]);

    return (
      <>
        {
          error?.text ? <Alert className="mt-2" variant='danger'>{error.text}</Alert> : null
        }
        <Form onSubmit={handleAddMessage} className='message-form'>
          <Form.Control
            required
            as="textarea"
            onChange={e => setFormState({ text: e.target.value })}
            placeholder='Your message...'
            value={formState.text}
          />
          {
            loading ?
              <Button variant="primary" disabled>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              </Button>
              :
              <Button variant="primary" type="submit">
                <span className="fas fa-paper-plane"></span>
              </Button>
          }
        </Form>
      </>
    );
  }