import jwt, { JwtPayload } from 'jsonwebtoken';

import ResponseError from '../models/response-error';

const isExpired = (exp: number) => {
    return Date.now() >= exp * 1000;
};

const clearPayload = (payload: JwtPayload) => {
    const res = { ...payload };

    delete res.aud;
    delete res.exp;
    delete res.iat;
    delete res.iss;
    delete res.jti;
    delete res.nbf;
    delete res.sub;

    return res;
};

export const extractToken = (auth: any) => {
    return auth?.split(' ')[1];
};

export const generateToken = (payload: any) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, { expiresIn: '1h' });
    const exp = (jwt.decode(token) as any).exp;
    return {
        id: token,
        expireAt: exp * 1000,
    };
};

export const updateTokenPayload = (auth: any, newPayload: any) => {
    try {
        const token = extractToken(auth);

        const payload: any = jwt.decode(token);

        if (!payload) {
            throw new ResponseError('token is required!', 400);
        }

        const expiresIn = payload.exp * 1000 - new Date().getTime();

        const updatedToken = jwt.sign(newPayload, process.env.JWT_SECRET_KEY as string, {
            expiresIn: (expiresIn < 0 ? 0 : expiresIn) + 'ms',
        });

        const exp = (jwt.decode(token) as any).exp; 
        
        return {
            id: updatedToken,
            expireAt: exp * 1000,
        };
    } catch (error) {
        throw error;
    }
};

export const refreshToken = (auth: any) => {
    try {
        const token = extractToken(auth);

        const payload: any = jwt.decode(token);

        if (!payload) {
            throw new ResponseError('token is required!', 400);
        }

        let newToken;

        if (isExpired(payload.exp)) {
            const userPayload = clearPayload(payload);
            newToken = generateToken(userPayload);
        } else {
            newToken = {
                id: token,
                expireAt: payload.exp * 1000,
            };
        }

        return newToken;
    } catch (error) {
        throw error;
    }
};
