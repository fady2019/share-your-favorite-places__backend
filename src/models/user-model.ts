import { Schema, model, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

import ResponseError from './response-error';
import { UserSchemaI, UserDocMethodsI, UserDocStaticsI } from './user-interfaces';

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
        toObject: { getters: true },
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

    user = await User.findOne({ email: this.email }).select('-password').exec();

    return user!.toObject();
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

    user = await User.findOne({ email: this.email }).select('-password').exec();

    return user!.toObject();
};

userSchema.methods.addPlace = async function (place) {
    await this.updateOne({
        $push: {
            places: place._id,
        },
    });
};

userSchema.methods.deletePlace = async function (place) {
    console.log(place._id.toString());
    await this.updateOne({
        $pull: {
            places: place._id,
        },
    });
};

/// STATICS
userSchema.statics.getUserPlaces = async function (userId) {
    const user = await this.findById(userId).populate('places').exec();

    if (!user) {
        throw new ResponseError("there's no user with the entered id!", 404);
    }

    const places = user.places;

    return places;
};

const User = model('User', userSchema);

export default User;
