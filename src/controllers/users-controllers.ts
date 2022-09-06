import { NextFunction, Request, Response } from 'express';

import User from '../models/user-model';
import { UserAuthI } from '../models/interfaces';
import { inputValidationResult } from '../utilities/input-validation-result-utility';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
    User.find()
        .select('name imgURL -_id')
        .then((users) => {
            res.status(200).json({
                message: 'users fetched successfully!',
                users,
            });
        })
        .catch((error) => next(error));
};

export const postSignup = (
    req: Request<any, any, UserAuthI>,
    res: Response,
    next: NextFunction
) => {
    try {
        // it will throw an error if there any invalid field
        inputValidationResult(req);
    } catch (error) {
        return next(error);
    }

    const user = new User({ ...req.body });

    user.signup()
        .then((user) => {
            res.status(201).json({
                message: 'user signed up successfully!',
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                },
            });
        })
        .catch((error) => next(error));
};

export const postLogin = (req: Request<any, any, UserAuthI>, res: Response, next: NextFunction) => {
    const user = new User({ ...req.body });

    user.login()
        .then((user) => {
            res.status(200).json({
                message: 'user logged in successfully!',
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                },
            });
        })
        .catch((error) => next(error));
};
