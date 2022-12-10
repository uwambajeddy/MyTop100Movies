import express, { json as _json } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRouter from './routers/userRouter.js';
import movieRouter from './routers/movieRouter.js';
import globalErrorHandler from './controller/errorController.js';
import AppError from './utils/AppError.js';

const { urlencoded, json } = bodyParser;

const app = express();

const corsConfig = {
    origin: true,
    credentials: true,
};

app.use(cors(corsConfig));
app.options('*', cors(corsConfig));
app.enable('trust proxy');

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.header('origin'));
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(urlencoded({ extended: false }));

app.use(_json());

app.use(json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use('/api/v1/user/', userRouter);
app.use('/api/v1/movies/', movieRouter);

app.all('*', (req, res, next) => {
    next(
        new AppError(`Opps! can't find "${req.originalUrl}" on this server!`, 404)
    );
});

app.use(globalErrorHandler);

export default app;
