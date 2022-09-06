import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import Place from '../models/place-model';
import ResponseError from '../models/response-error';
import { PlaceI, PlaceLocationI } from '../models/interfaces';
import { getLocationForAddress } from '../utilities/location-utility';
import { inputValidationResult } from '../utilities/input-validation-result-utility';

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
                throw new ResponseError('the place not found!', 404);
            }

            res.status(200).json({
                message: 'place fetched successfully!',
                place,
            });
        })
        .catch((error) => next(error));
};

export const createPlace = async (
    req: Request<any, any, PlaceI>,
    res: Response,
    next: NextFunction
) => {
    try {
        // it will throw an error if there any invalid field
        inputValidationResult(req);
    } catch (error) {
        return next(error);
    }

    const { address, description, title } = req.body;

    let location: PlaceLocationI;

    try {
        location = await getLocationForAddress(address);
    } catch (error) {
        return next(error);
    }

    const place = new Place({
        title,
        address,
        description,
        location,
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

export const updatePlace = async (
    req: Request<{ placeId: string }, any, PlaceI>,
    res: Response,
    next: NextFunction
) => {
    try {
        // it will throw an error if there any invalid field
        inputValidationResult(req);
    } catch (error) {
        return next(error);
    }

    const { placeId } = req.params;
    const { address, description, title } = req.body;

    let location: PlaceLocationI;

    try {
        location = await getLocationForAddress(address);
    } catch (error) {
        return next(error);
    }

    Place.findById(placeId)
        .then((place) => {
            if (!place) {
                throw new ResponseError('the place not found!', 404);
            }

            place.title = title;
            place.description = description;
            place.address = address;
            place.location = location;

            return place.save();
        })
        .then((place) => {
            res.status(200).json({
                message: 'place updated successfully!',
                place
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
                throw new ResponseError('the place not found!', 404);
            }

            return place.delete();
        })
        .then(() => {
            res.status(200).json({
                message: 'place deleted successfully!',
            });
        })
        .catch((error) => next(error));
};
