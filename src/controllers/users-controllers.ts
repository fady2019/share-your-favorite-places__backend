import { NextFunction, Request, Response } from 'express';

import User from '../models/user-model';
import ResponseError from '../models/response-error';
import {
    UserAuthI,
    UserChangeEmailI,
    UserChangeNameI,
    UserChangePasswordI,
    UserDeleteAccount,
} from '../models/user-interfaces';
import { inputValidationResult } from '../utilities/input-validation-result-utility';
import { getPathFromURL, getURL } from '../utilities/path-utility';
import { generateToken, updateTokenPayload } from '../utilities/token-utility';
import { deleteFile } from '../utilities/file-utility';

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

    const user = new User({ ...req.body });

    user.signup()
        .then((user) => {
            const token = generateToken({
                id: user._id.toString(),
                email: user.email,
            });

            res.status(201).json({
                message: 'user signed up successfully!',
                user,
                token,
            });
        })
        .catch((error) => next(error));
};

export const postLogin = (req: Request<any, any, UserAuthI>, res: Response, next: NextFunction) => {
    const user = new User({ ...req.body });

    user.login()
        .then((user) => {
            const token = generateToken({
                id: user._id.toString(),
                email: user.email,
            });

            res.status(200).json({
                message: 'user logged in successfully!',
                user,
                token,
            });
        })
        .catch((error) => next(error));
};

export const deleteAccount = (
    req: Request<any, any, UserDeleteAccount>,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;

    if (!userId) {
        throw new ResponseError("can't get user id!", 401);
    }

    const { password } = req.body;

    User.deleteUser(userId, password)
        .then(() => {
            res.status(200).json({
                message: 'user account deleted successfully!',
            });

            deleteFile('/media/' + userId);
        })
        .catch((error) => next(error));
};

export const changeEmail = (req: Request<any, any, UserChangeEmailI>, res: Response, next: NextFunction) => {
    // it will throw an error if there any invalid field
    inputValidationResult(req);

    const userId = req.user?.id;

    if (!userId) {
        throw new ResponseError("can't get user id!", 401);
    }

    const { newEmail, password } = req.body;

    User.changeUserEmail(userId, password, newEmail)
        .then((user) => {
            const token = updateTokenPayload(req.headers.authorization, {
                id: user._id.toString(),
                email: user.email,
            });

            res.status(200).json({
                message: 'user email changed successfully!',
                user,
                token,
            });
        })
        .catch((error) => next(error));
};

export const changePassword = (
    req: Request<any, any, UserChangePasswordI>,
    res: Response,
    next: NextFunction
) => {
    // it will throw an error if there any invalid field
    inputValidationResult(req);

    const userId = req.user?.id;

    if (!userId) {
        throw new ResponseError("can't get user id!", 401);
    }

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

export const changeName = (req: Request<any, any, UserChangeNameI>, res: Response, next: NextFunction) => {
    // it will throw an error if there any invalid field
    inputValidationResult(req);

    const userId = req.user?.id;

    if (!userId) {
        throw new ResponseError("can't get user id!", 401);
    }

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

export const changeAvatar = (isImageRequired: boolean) => {
    return (req: Request, res: Response, next: NextFunction) => {
        let imgPath: any;

        if (isImageRequired) {
            imgPath = req.file?.path;

            if (!imgPath) {
                throw new ResponseError('user image is required!', 422);
            }
        }

        const userId = req.user?.id;

        if (!userId) {
            throw new ResponseError("can't get user id!", 401);
        }

        const imgURL = imgPath ? getURL(req) + imgPath : undefined;

        User.changeUserAvatar(userId, imgURL)
            .then(([user, prevImgURL]) => {
                res.status(200).json({
                    message: 'user avatar changed successfully!',
                    user,
                });

                if (!prevImgURL) {
                    return;
                }

                const prevImgPath = getPathFromURL(prevImgURL);

                if (prevImgPath) {
                    deleteFile(prevImgPath);
                }
            })
            .catch((error) => {
                next(error);

                if (imgPath) {
                    deleteFile(imgPath);
                }
            });
    };
};
