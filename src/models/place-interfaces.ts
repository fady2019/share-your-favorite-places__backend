import { ClientSession, Document, FlatRecord, Model, Types } from 'mongoose';

export interface PlaceI {
    title: string;
    address: string;
    description: string;
    imgURL: string;
}

export interface PlaceLocationI {
    lat: number;
    lng: number;
}

export interface PlaceSchemaI extends PlaceI {
    location: PlaceLocationI;
}

export type PlaceDocT = Document<unknown, any, FlatRecord<PlaceSchemaI>> &
    FlatRecord<PlaceSchemaI> & {
        _id: Types.ObjectId;
    };

export type PLaceModelT = Model<FlatRecord<PlaceSchemaI>, {}, {}, {}, any>;

export interface PlaceDocMethodsI {
    add: (this: PlaceDocT) => Promise<any>;
    rmv: (this: PlaceDocT) => Promise<any>;
}

export interface PlaceDocStaticsI {
    deleteUserPlaces: (this: PLaceModelT, userId: Types.ObjectId | string, session: ClientSession) => Promise<any>;
}
