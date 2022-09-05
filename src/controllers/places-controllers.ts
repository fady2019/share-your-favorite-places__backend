import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import Place from '../models/place-model';
import { PlaceI } from '../models/interfaces';

export const getUserPLaces = (
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction
) => {
    const { userId } = req.params;
};

export const getPlace = (req: Request<{ placeId: string }>, res: Response, next: NextFunction) => {
    const { placeId } = req.params;

    Place.findById(placeId)
        .then((place) => {
            if (!place) {
                throw new CustomError("the place isn't found!", 404);
            }

            res.status(200).json({
                message: 'place fetched successfully!',
                place,
            });
        })
        .catch((error) => next(error));
};

export const createPlace = (req: Request<any, any, PlaceI>, res: Response, next: NextFunction) => {
    const validation = validationResult(req);

    if (!validation.isEmpty()) {
        return res.status(422).json({
            message: validation.array().at(0)?.msg,
        });
    }

    const { address, description, title } = req.body;

    const place = new Place({
        title,
        address,
        description,
    });

    place
        .save()
        .then((place) => {
            res.status(201).json({
                message: 'place created successfully!',
                place,
            });
        })
        .catch((error) => next(error));
};

export const updatePlace = (
    req: Request<{ placeId: string }, any, PlaceI>,
    res: Response,
    next: NextFunction
) => {
    const { placeId } = req.params;
    const { address, description, title } = req.body;

    Place.findById(placeId)
        .then((place) => {
            if (!place) {
                throw new CustomError("the place isn't found!", 404);
            }

            place.title = title;
            place.description = description;
            place.address = address;

            return place.save();
        })
        .then((place) => {
            res.status(204).json({
                message: 'place updated successfully!',
            });
        })
        .catch((error) => next(error));
};

export const deletePLace = (
    req: Request<{ placeId: string }>,
    res: Response,
    next: NextFunction
) => {
    const { placeId } = req.params;

    Place.findById(placeId)
        .then((place) => {
            if (!place) {
                throw new CustomError("the place isn't found!", 404);
            }

            return place.delete();
        })
        .then(() => {
            res.status(204).json({
                message: 'place deleted successfully!',
            });
        })
        .catch((error) => next(error));
};
