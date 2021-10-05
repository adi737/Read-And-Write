import express from 'express';
import { config } from 'dotenv';
import fileUpload from 'express-fileupload';
import path from 'path';
import connectDB from './db';
import user from './routes/user';
import profile from './routes/profile';
import article from './routes/article';
import messenger from './routes/messenger';
import http from 'http';
import { Server } from 'socket.io';


//use environment variables
config();

//set server
const app = express();
const server = http.createServer(app);
const io = new Server(server,
  process.env.NODE_ENV === 'production' ? {} : {
    cors: {
      origin: "http://localhost:3000",
    }
  });

//connect database
connectDB();

//use middlewares
app.use(express.json());
app.use(fileUpload());

//set routes
app.use('/api/user', user);
app.use('/api/profile', profile);
app.use('/api/article', article);
app.use('/api/messenger', messenger);

//set static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  })
}

//run server
const PORT = process.env.PORT || 8050;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

//socket.io
let users: {
  userId: string;
  email: string;
  nick: string;
  avatar: string;
  date: string;
  socketId: string;
}[] = [];

const addUser = (userId: string, email: string, nick: string, avatar: string, date: string, socketId: string) => {
  users.push({
    userId,
    email,
    nick,
    avatar,
    date,
    socketId
  });
}

const removeUser = (socketId: string) => {
  users = users.filter(user => user.socketId !== socketId);
}

io.on("connection", (socket) => {
  console.log('Socket.io connected');

  //add user
  socket.on("addUser", ({ userId, email, nick, avatar, date }) => {
    addUser(userId, email, nick, avatar, date, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("removeUser", () => {
    //remove user
    removeUser(socket.id)
    io.emit("getUsers", users);
  });

  socket.on('disconnect', () => {
    console.log('Socket.io disconnected');

    //remove user
    removeUser(socket.id)
    io.emit("getUsers", users);
  });

  socket.on('addMessage', ({ memberId, message }) => {
    const userArr = users.filter(user => user.userId === memberId);
    const socketIds = userArr.map(user => user.socketId);

    if (socketIds.length !== 0) {
      io.to(socketIds).emit('getMessage', message);
    }
  })
});