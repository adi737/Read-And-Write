import React, { useEffect } from 'react'
import { io } from "socket.io-client";

// interface MessengerProps {

// }

const Messenger = () => {
  const socket = io(process.env.NODE_ENV === 'production' ?
    'https://read-and-write-app.herokuapp.com' : 'http://localhost:8050');

  useEffect(() => {
    socket.on('message', (message) => {
      console.log(message)
    })
  }, [socket]);

  return <div>messenger</div>

}

export default Messenger