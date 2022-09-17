import { Router } from 'express';

import {
    changeAvatar,
    changeEmail,
    changeName,
    changePassword,
    deleteAccount,
    getUsers,
    postLogin,
    postSignup,
} from '../controllers/users-controllers';

import {
    userChangeEmailValidator,
    userChangeNameValidator,
    userChangePasswordValidator,
    userSignupValidator,
} from '../validators/user-validator';

import { tokenChecker } from '../middlewares/token-checker-middleware';
import { imageUploader } from '../middlewares/image-uploader-middleware';

const router = Router();

// GET /users/
// get users
// Need No Authentication
router.get('/', getUsers);

// POST /users/signup
// signup a user
// Need No Authentication
router.post('/signup', userSignupValidator, postSignup);

// POST /users/login
// login a user
// Need No Authentication
router.post('/login', postLogin);

router.use(tokenChecker());

//PARCH /users/change/email
// change user email (password and new email are required)
// Need Authentication
router.patch('/change/email', userChangeEmailValidator, changeEmail);

//PARCH /users/change/password
// change user password (password and new password are required)
// Need Authentication
router.patch('/change/password', userChangePasswordValidator, changePassword);

// PATCH /users/change/name
// change user name
// Need Authentication
router.patch('/change/name', userChangeNameValidator, changeName);

// PATCH /users/change/avatar
// change user avatar
// Need Authentication
router.patch('/change/avatar', imageUploader('avatar').single('image'), changeAvatar(true));

// DELETE /users/reset/avatar
// reset user avatar
// Need Authentication
router.delete('/reset/avatar', changeAvatar(false));

// POST /users/delete
// delete a user account
// Need Authentication
router.post('/delete', deleteAccount);

export default router;
