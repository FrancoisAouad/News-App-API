import express, { Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import { Application } from 'express';
import corsConfig from './config/corsConfig';
import authRoutes from './routes/auth';
import homeRoutes from './routes/news';
import adminRoutes from './routes/admin';
import './config/mongoCon';
import './config/redisCon';
import * as dotenv from 'dotenv';
import { errorHandler, sendError } from './utils/errors/errorHandlers';
import formData from 'express-form-data';
// import multer from 'multer';
dotenv.config();
import 'colors';

//INITIALIZATION
const app: Application = express();
app.use(express.json());
// app.use(formData.parse());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
// app.use(multer());
// app.use(formData.parse());
app.use(cors(corsConfig));
app.use(formData.parse());
// app.use(formData.parse());
//ROUTES

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', homeRoutes);
app.use('/api/v1/admin', adminRoutes);

//ERROR HANDLERS
app.use(sendError);
app.use(errorHandler);

//SERVER
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`.cyan.bold);
});
