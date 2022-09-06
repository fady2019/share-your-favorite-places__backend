import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import placesRoutes from './routes/places-routes';
import usersRoutes from './routes/users-routes';
import ResponseError from './models/response-error';

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    next();
});

app.use('/places', placesRoutes);

app.use('/users', usersRoutes);

// not found route
app.use((req, res, next) => {
    throw new ResponseError(`'${req.url}' route not found!`, 404);
});

app.use((err: any, _req: any, res: any, _next: any) => {
    const message = err.message || 'an unknown error have been occurred!';
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        message,
    });
});

mongoose
    .connect(process.env.MONGODB_CONNECTION_URI as string, {
        user: process.env.MONGODB_CONNECTION_USERNAME,
        pass: process.env.MONGODB_CONNECTION_PASSWORD,
        // autoIndex: false, // should be added on production
    })
    .then(() => {
        app.listen(8080);
    })
    .catch((error) => {
        console.log(error);
    });
