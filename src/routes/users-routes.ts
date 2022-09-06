import { Router } from 'express';

import { getUsers, postLogin, postSignup } from '../controllers/users-controllers';
import { userValidator } from '../validators/user-validator';

const router = Router();

// GET /users/
// get users
router.get('/', getUsers);

// POST /users/signup
// signup a user
router.post('/signup', userValidator, postSignup);

// POST /users/login
// login a user
router.post('/login', postLogin);

export default router;
