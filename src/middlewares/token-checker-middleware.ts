import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import ResponseError from '../models/response-error';
import { extractToken } from '../utilities/token-utility';

export const tokenChecker = (ignoreExpiration = false) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (req.method === 'OPTIONS') {
            return next();
        }

        const token = extractToken(req.headers.authorization);

        if (!token) {
            return next(new ResponseError('authentication failed, a token is required!', 403));
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY as string, { ignoreExpiration });

        req.user = payload;

        next();
    };
};
