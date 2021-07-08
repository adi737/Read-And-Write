import express from 'express';
import { config } from 'dotenv';
import fileUpload from 'express-fileupload';
import path from 'path';
import connectDB from './db';
import user from './routes/user';
import profile from './routes/profile';
import article from './routes/article';

const app = express();

//use environment variables
config();

//connect database
connectDB();

//use middlewares
app.use(express.json());
app.use(fileUpload());

//set routes
app.use('/api/user', user);
app.use('/api/profile', profile);
app.use('/api/article', article);

//set static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  })
}

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));