import { Router } from 'express';

import {
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

// POST /users/delete
// delete a user account
// Need Authentication
router.post('/delete', deleteAccount);

export default router;
