import { Router } from 'express';

import { changeEmail, changeName, changePassword, deleteAccount, getUsers, postLogin, postSignup } from '../controllers/users-controllers';
import { userChangeEmailValidator, userChangeNameValidator, userChangePasswordValidator, userSignupValidator } from '../validators/user-validator';

const router = Router();

// GET /users/
// get users
router.get('/', getUsers);

// POST /users/signup
// signup a user
router.post('/signup', userSignupValidator, postSignup);

// POST /users/login
// login a user
router.post('/login', postLogin);

//PARCH /users/change/email/:userId
// change user email (password and new email are required)
router.patch('/change/email/:userId', userChangeEmailValidator, changeEmail);

//PARCH /users/change/password/:userId
// change user password (password and new password are required)
router.patch('/change/password/:userId', userChangePasswordValidator, changePassword);

// PATCH /users/change/name/:userId
// change user name
router.patch('/change/name/:userId', userChangeNameValidator, changeName);

// POST /users/delete/:userId
// delete a user account
router.post('/delete/:userId', deleteAccount);

export default router;
