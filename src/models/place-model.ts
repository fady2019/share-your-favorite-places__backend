import { Model, model, Schema, startSession } from 'mongoose';

import User from './user-model';
import { PlaceDocMethodsI, PlaceSchemaI } from './place-interfaces';
import ResponseError from './response-error';

const placeSchema = new Schema<PlaceSchemaI, Model<PlaceSchemaI>, PlaceDocMethodsI>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        address: { type: String, required: true },
        imgURL: { type: String, required: true },
        location: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
        },
        creator: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    },
    {
        timestamps: true,
        toObject: { getters: true },
    }
);

placeSchema.methods.add = async function () {
    const session = await startSession();
    session.startTransaction();

    const creator = await User.findById(this.creator, undefined, { session }).exec();

    if (!creator) {
        throw new ResponseError("there's no user with the entered creator!", 404);
    }

    const place = await Place.findOne({ creator: creator._id, location: this.location }, undefined, { session }).exec();

    if (place) {
        throw new ResponseError("there's already a place with the entered address!", 409);
    }

    await this.save({ session });

    await creator.set('session', session).addPlace(this);

    await session.commitTransaction();

    return this.toObject();
};

placeSchema.methods.rmv = async function () {
    const session = await startSession();
    session.startTransaction();

    const creator = await User.findById(this.creator, undefined, { session }).exec();

    if (!creator) {
        throw new ResponseError('place creator not found!', 404);
    }

    await creator.set('session', session).deletePlace(this);

    await this.delete({ session });

    await session.commitTransaction();

    return null;
};

const Place = model('Place', placeSchema);

export default Place;
