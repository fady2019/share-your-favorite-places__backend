import { body } from 'express-validator';

const nameValidator = (field: string) =>
    body(field)
        .not()
        .isEmpty()
        .withMessage('user name is required!')
        .isAlpha(undefined, { ignore: [' '] })
        .withMessage('user name should consist of English alphabetic only!');

const emailValidator = (field: string) =>
    body(field).normalizeEmail().not().isEmpty().withMessage('user email is required!').isEmail().withMessage('invalid user email!');

const passwordValidator = (field: string) =>
    body(field)
        .isLength({ min: 8 })
        .withMessage('user password should be at least 8 characters!')
        .isStrongPassword({ minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 })
        .withMessage('user password is week, enter a password contains lowercase and uppercase letters, numbers, and symbols!');

export const userSignupValidator = [nameValidator('name'), emailValidator('email'), passwordValidator('password')];

export const userChangeEmailValidator = [emailValidator('newEmail')];

export const userChangePasswordValidator = [passwordValidator('newPassword')];
