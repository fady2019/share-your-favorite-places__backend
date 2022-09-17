import { Document, FlatRecord, Model, Types } from 'mongoose';
import { PlaceDocT } from './place-interfaces';

export interface UserAuthI {
    name?: string;
    email: string;
    password: string;
}

export interface UserChangeNameI {
    name: string;
}

export interface UserChangeEmailI {
    newEmail: string;
    password: string;
}

export interface UserChangePasswordI {
    newPassword: string;
    password: string;
}

export interface UserDeleteAccount {
    password: string;
}

export interface UserSchemaI extends UserAuthI {
    imgURL: string;
    places: [Types.ObjectId];
}

export type UserDocT = Document<unknown, any, FlatRecord<UserSchemaI>> &
    FlatRecord<UserSchemaI> & {
        _id: Types.ObjectId;
    };

export type UserModelT = Model<FlatRecord<UserSchemaI>, {}, {}, {}, any>;

export interface UserDocMethodsI {
    signup: (this: UserDocT) => Promise<UserSchemaI & { _id: Types.ObjectId }>;
    login: (this: UserDocT) => Promise<UserSchemaI & { _id: Types.ObjectId }>;
    addPlace: (this: UserDocT, place: PlaceDocT) => Promise<any>;
    deletePlace: (this: UserDocT, place: PlaceDocT) => Promise<any>;
}

export interface UserDocStaticsI {
    changeUserEmail: (this: UserModelT, userId: Types.ObjectId | string, password: string, newEmail: string) => Promise<any>;
    changeUserPassword: (this: UserModelT, userId: Types.ObjectId | string, password: string, newPassword: string) => Promise<any>;
    changeUserName: (this: UserModelT, userId: Types.ObjectId | string, name: string) => Promise<any>;
    changeUserAvatar: (this: UserModelT, userId: Types.ObjectId | string, newAvatar: any) => Promise<any>;
    getUserPlaces: (this: UserModelT, userId: Types.ObjectId | string) => Promise<[any]>;
    deleteUser: (this: UserModelT, userId: Types.ObjectId | string, password: string) => Promise<any>;
}
