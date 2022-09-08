import { Types } from 'mongoose';

import ResponseError from '../models/response-error';

export const castToObjectId = (id: Types.ObjectId | string) => {
    try {
        return new Types.ObjectId(id);
    } catch (error) {
        throw new ResponseError('invalid id!', 422);
    }
};
