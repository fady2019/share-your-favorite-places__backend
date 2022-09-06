import { body } from 'express-validator';

export const userValidator = [
    body('name')
        .not()
        .isEmpty()
        .withMessage('user name is required!')
        .isAlpha(undefined, { ignore: [' '] })
        .withMessage('user name should consist of English alphabetic only!'),

    body('email')
        .normalizeEmail()
        .not()
        .isEmpty()
        .withMessage('user email is required!')
        .isEmail()
        .withMessage('invalid user email!'),

    body('password')
        .isLength({ min: 8 })
        .withMessage('user password should be at least 8 characters!')
        .isStrongPassword({ minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 })
        .withMessage(
            'user password is week, enter a password contains lowercase and uppercase letters, numbers, and symbols!'
        ),
];
