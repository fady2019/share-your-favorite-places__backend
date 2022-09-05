import { body } from 'express-validator';

export const placeValidator = [
    body('title', "place title can't be empty!").not().isEmpty(),

    body('address', "place address can't be empty!").not().isEmpty(),

    body('description', 'place description should be at least 8 characters!').isLength({ min: 8 }),
];
