import { Schema, model, Model, startSession, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

import Place from './place-model';
import ResponseError from './response-error';
import { UserSchemaI, UserDocMethodsI, UserDocStaticsI, UserDocT } from './user-interfaces';
import { castToObjectId } from '../utilities/id-caster-utility';

const userSchema = new Schema<UserSchemaI, Model<UserSchemaI>, UserDocMethodsI, {}, {}, UserDocStaticsI>(
    {
        name: { type: String, required: true },
        imgURL: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        places: {
            type: [{ type: Schema.Types.ObjectId, ref: 'Place' }],
            default: [],
        },
    },
    {
        timestamps: true,
        toObject: { getters: true, virtuals: true },
        virtuals: {
            placeCount: {
                get(this: UserDocT): number {
                    return this.places.length;
                },
            },
        },
    }
);

/// METHODS
userSchema.methods.signup = async function () {
    let user = await User.findOne({ email: this.email });

    // check if email exists already
    if (user) {
        throw new ResponseError('user email already exists!', 409);
    }

    this.password = await bcrypt.hash(this.password as string, 12);

    await this.save();

    user = await User.findOne({ email: this.email }).select('-password -places').exec();

    return user!.toObject({ virtuals: ['id'] });
};

userSchema.methods.login = async function () {
    let user = await User.findOne({ email: this.email });

    // check if email not exists
    if (!user) {
        throw new ResponseError('user email not exists!', 401);
    }

    const isCorrectPassword = await bcrypt.compare(this.password, user.password);

    if (!isCorrectPassword) {
        throw new ResponseError('incorrect user password!', 401);
    }

    user = await User.findOne({ email: this.email }).select('-password -places').exec();

    return user!.toObject({ virtuals: ['id'] });
};

userSchema.methods.addPlace = async function (place) {
    await this.updateOne({
        $push: {
            places: place._id,
        },
    });
};

userSchema.methods.deletePlace = async function (place) {
    await this.updateOne({
        $pull: {
            places: place._id,
        },
    });
};

/// STATICS
userSchema.statics.changeUserEmail = async function (userId, password, newEmail) {
    // it throws error if userId can't be converted to ObjectId
    const _id = castToObjectId(userId);

    let user = await User.findOne({ email: newEmail }).exec();

    if (user) {
        throw new ResponseError('user email already exists!', 409);
    }

    user = await User.findById(_id).exec();

    if (!user) {
        throw new ResponseError("there's no user with the entered id!", 404);
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
        throw new ResponseError('incorrect user password!', 401);
    }

    user.email = newEmail;

    await user.save();

    user = await User.findById(_id).select('-password -places').exec();

    return user!.toObject({ virtuals: ['id'] });
};

userSchema.statics.changeUserPassword = async function (userId, password, newPassword) {
    // it throws error if userId can't be converted to ObjectId
    const _id = castToObjectId(userId);

    let user = await User.findById(_id).exec();

    if (!user) {
        throw new ResponseError("there's no user with the entered id!", 404);
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
        throw new ResponseError('incorrect user password!', 401);
    }

    user.password = await bcrypt.hash(newPassword, 12);

    await user.save();

    user = await User.findById(_id).select('-password -places').exec();

    return user!.toObject({ virtuals: ['id'] });
};

userSchema.statics.changeUserName = async function (userId, name) {
    // it throws error if userId can't be converted to ObjectId
    const _id = castToObjectId(userId);

    let user = await User.findById(_id).exec();

    if (!user) {
        throw new ResponseError("there's no user with the entered id!", 404);
    }

    user.name = name;

    await user.save();

    user = await User.findById(_id).select('-password -places').exec();

    return user!.toObject({ virtuals: ['id'] });
};

userSchema.statics.getUserPlaces = async function (userId) {
    const user = await this.findById(userId).populate('places').exec();

    if (!user) {
        throw new ResponseError("there's no user with the entered id!", 404);
    }

    const places = user.places;

    return places;
};

userSchema.statics.deleteUser = async function (userId, password) {
    // it throws error if userId can't be converted to ObjectId
    const _id = castToObjectId(userId);

    const user = await User.findById(_id).exec();

    if (!user) {
        throw new ResponseError("there's no user with the entered id!", 404);
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
        throw new ResponseError('incorrect user password!', 401);
    }

    const session = await startSession();
    session.startTransaction();

    await Place.deleteUserPlaces(_id, session);

    await User.deleteOne({ _id }, { session }).exec();

    await session.commitTransaction();

    return null;
};

const User = model('User', userSchema);

export default User;
