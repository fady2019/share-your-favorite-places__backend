import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

import ResponseError from './response-error';

const userSchema = new Schema<any, any, { signup: () => Promise<any>; login: () => Promise<any> }>({
    name: String,
    imgURL: String,
    email: String,
    password: String,
});

userSchema.methods.signup = async function () {
    const user = await User.findOne({ email: this.email });

    // check if email exists already
    if (user) {
        throw new ResponseError('user email already exists!', 409);
    }

    this.password = await bcrypt.hash(this.password as string, 12);

    return this.save();
};

userSchema.methods.login = async function () {
    const user = await User.findOne({ email: this.email });

    // check if email not exists
    if (!user) {
        throw new ResponseError('user email not exists!', 401);
    }

    const isCorrectPassword = await bcrypt.compare(this.password, user.password);

    if (!isCorrectPassword) {
        throw new ResponseError('incorrect user password!', 401);
    }

    return user;
};

const User = model('User', userSchema);

export default User;
