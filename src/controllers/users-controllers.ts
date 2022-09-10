import { NextFunction, Request, Response } from 'express';

import User from '../models/user-model';
import { UserAuthI, UserChangeEmailI, UserChangeNameI, UserChangePasswordI, UserDeleteAccount } from '../models/user-interfaces';
import { inputValidationResult } from '../utilities/input-validation-result-utility';
import { getURL } from '../utilities/path-utility';

export const getUsers = (_req: Request, res: Response, next: NextFunction) => {
    User.find()
        .select('name imgURL places _id')
        .exec()
        .then((users) => {
            res.status(200).json({
                message: 'users fetched successfully!',
                users: users.map((user) => ({ ...user.toObject(), places: undefined })),
            });
        })
        .catch((error) => next(error));
};

export const postSignup = (req: Request<any, any, UserAuthI>, res: Response, next: NextFunction) => {
    try {
        // it will throw an error if there any invalid field
        inputValidationResult(req);
    } catch (error) {
        return next(error);
    }

    const defaultImgURL = getURL(req) + '/media/images/default-user-img.svg';

    const user = new User({ ...req.body, imgURL: defaultImgURL });

    user.signup()
        .then((user) => {
            res.status(201).json({
                message: 'user signed up successfully!',
                user,
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
                user,
            });
        })
        .catch((error) => next(error));
};

export const deleteAccount = (req: Request<{ userId: string }, any, UserDeleteAccount>, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { password } = req.body;

    User.deleteUser(userId, password)
        .then(() => {
            res.status(200).json({
                message: 'user account deleted successfully!',
            });
        })
        .catch((error) => next(error));
};

export const changeEmail = (req: Request<{ userId: string }, any, UserChangeEmailI>, res: Response, next: NextFunction) => {
    // it will throw an error if there any invalid field
    inputValidationResult(req);

    const { userId } = req.params;
    const { newEmail, password } = req.body;

    User.changeUserEmail(userId, password, newEmail)
        .then((user) => {
            res.status(200).json({
                message: 'user email changed successfully!',
                user,
            });
        })
        .catch((error) => next(error));
};

export const changePassword = (req: Request<{ userId: string }, any, UserChangePasswordI>, res: Response, next: NextFunction) => {
    // it will throw an error if there any invalid field
    inputValidationResult(req);

    const { userId } = req.params;
    const { newPassword, password } = req.body;

    User.changeUserPassword(userId, password, newPassword)
        .then((user) => {
            res.status(200).json({
                message: 'user password changed successfully!',
                user,
            });
        })
        .catch((error) => next(error));
};

export const changeName = (req: Request<{ userId: string }, any, UserChangeNameI>, res: Response, next: NextFunction) => {
    // it will throw an error if there any invalid field
    inputValidationResult(req);

    const { userId } = req.params;
    const { name } = req.body;

    User.changeUserName(userId, name)
        .then((user) => {
            res.status(200).json({
                message: 'user name changed successfully!',
                user,
            });
        })
        .catch((error) => next(error));
};
