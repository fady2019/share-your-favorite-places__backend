import { NextFunction, Request, Response } from 'express';

import User from '../models/user-model';
import Place from '../models/place-model';
import ResponseError from '../models/response-error';
import { PlaceI } from '../models/place-interfaces';
import { getLocationForAddress } from '../utilities/location-utility';
import { inputValidationResult } from '../utilities/input-validation-result-utility';
import { deleteFile } from '../utilities/file-utility';
import { getURL } from '../utilities/path-utility';

export const getUserPLaces = (req: Request<{ userId: string }>, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    User.getUserPlaces(userId)
        .then((places) => {
            res.status(200).json({
                message: 'user places fetched successfully!',
                places: places.map((place) => ({
                    ...place.toObject({ virtuals: ['placeCount', 'id'] }),
                    imgURL: getURL(req) + place.imgURL,
                })),
            });
        })
        .catch((error) => next(error));
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
                place: {
                    ...place.toObject(),
                    imgURL: getURL(req) + place.imgURL,
                },
            });
        })
        .catch((error) => next(error));
};

export const createPlace = async (req: Request<any, any, PlaceI>, res: Response, next: NextFunction) => {
    let imgPath: any;

    try {
        imgPath = req.file?.path;

        // it will throw an error if there any invalid field
        inputValidationResult(req);

        if (!imgPath) {
            throw new ResponseError('place image is required!', 422);
        }

        const { address } = req.body;
        const location = await getLocationForAddress(address);

        const creator = req.user?.id;

        if (!creator) {
            throw new ResponseError("can't get place creator!", 401);
        }

        const place = new Place({
            ...req.body,
            location,
            imgURL: imgPath,
            creator,
        });

        const addedPlace = await place.add();

        res.status(201).json({
            message: 'place created successfully!',
            place: {
                ...addedPlace,
                imgURL: getURL(req) + addedPlace.imgURL,
            },
        });
    } catch (error) {
        next(error);

        if (imgPath) {
            deleteFile(imgPath);
        }
    }
};

export const updatePlace = async (
    req: Request<{ placeId: string }, any, PlaceI>,
    res: Response,
    next: NextFunction
) => {
    let newImgPath: any;
    let crtImgPath: any;

    try {
        newImgPath = req.file?.path;

        // it will throw an error if there any invalid field
        inputValidationResult(req);

        const { placeId } = req.params;
        const { address, description, title } = req.body;
        let location = await getLocationForAddress(address);

        const creator = req.user?.id;

        if (!creator) {
            throw new ResponseError("can't get place creator!", 401);
        }

        const place = await Place.findById(placeId);

        if (!place) {
            throw new ResponseError('the place not found!', 404);
        }

        if (place.creator.toString() !== creator) {
            throw new ResponseError("you're not allowed to edit this place!", 403);
        }

        place.title = title;
        place.description = description;
        place.address = address;
        place.location = location;

        if (newImgPath) {
            crtImgPath = place.imgURL;
            place.imgURL = newImgPath;
        }

        place.save().then((place) => {
            res.status(200).json({
                message: 'place updated successfully!',
                place: {
                    ...place.toObject(),
                    imgURL: getURL(req) + place.imgURL,
                },
            });

            if (crtImgPath) {
                deleteFile(crtImgPath);
            }
        });
    } catch (error) {
        next(error);

        if (newImgPath) {
            deleteFile(newImgPath);
        }
    }
};

export const deletePLace = (req: Request<{ placeId: string }>, res: Response, next: NextFunction) => {
    const { placeId } = req.params;

    const creator = req.user?.id;

    if (!creator) {
        throw new ResponseError("can't get place creator!", 401);
    }

    let imgURL: any;

    Place.findById(placeId)
        .then((place) => {
            if (!place) {
                throw new ResponseError('the place not found!', 404);
            }

            if (place.creator.toString() !== creator) {
                throw new ResponseError("you're not allowed to delete this place!", 403);
            }

            imgURL = place.imgURL;

            return place.rmv(); // rmv => remove
        })
        .then(() => {
            res.status(200).json({
                message: 'place deleted successfully!',
                placeId,
            });

            deleteFile(imgURL);
        })
        .catch((error) => next(error));
};
