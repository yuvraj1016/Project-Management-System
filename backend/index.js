import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './mongodb/connectDb.js';
import userRoutes from './Routes/userRoutes.js';
import professorRoutes from "./Routes/professorRoute.js";
import postRoutes from "./Routes/postRoutes.js";
import notification from "./Routes/notificationRoute.js"
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '100mb' }));


app.use('/api/v1/user', userRoutes);
app.use('/api/v1/professor',professorRoutes);
app.use('/api/v1/post',postRoutes);
app.use('/api/v1/notification',notification)


const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(3001, () => console.log('Server started on port 3001'));
  } catch (error) {
    console.log(error);
  }
};

startServer();
