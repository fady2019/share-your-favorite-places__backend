import { Router } from 'express';

import ResponseError from '../models/response-error';
import { tokenChecker } from '../middlewares/token-checker-middleware';
import { refreshToken } from '../utilities/token-utility';
import User from '../models/user-model';

const router = Router();

// token/refresh
router.post('/refresh', tokenChecker(true), (req, res, next) => {
    const user = req.user;

    const token = refreshToken(req.headers.authorization);

    User.findOne({ _id: user?.id, email: user?.email })
        .select('-password -places')
        .exec()
        .then((user) => {
            if (!user) {
                throw new ResponseError('user not exists, please login again with your credentials!', 400);
            }

            res.status(200).json({
                message: 'refreshed successfully!',
                user: user.toObject({ virtuals: ['id'] }),
                token,
            });
        })
        .catch((error) => next(error));
});

export default router;
