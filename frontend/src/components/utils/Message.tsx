import { State } from 'interfaces';
import React from 'react'
import { useSelector } from 'react-redux';

interface MessageProps {
  message: any;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const userID = useSelector((state: State) => state.user.userID);

  return userID === message.userID._id ?
    <div className='my-message'>{message.text}</div> :
    <div className='not-my-message'>{message.text}</div>

}