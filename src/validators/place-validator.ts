import { body } from 'express-validator';

export const placeValidator = [
    body('title', "place title is required!").not().isEmpty(),

    body('address', "place address is required!").not().isEmpty(),

    body('description', 'place description should be at least 8 characters!').isLength({ min: 8 }),
];
