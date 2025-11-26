import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './Routes/index.js';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser()); 
app.use(morgan('tiny'));

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Server error' });
});

export default app;
