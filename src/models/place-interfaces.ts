import { Document, FlatRecord, Types } from 'mongoose';

export interface PlaceI {
    title: string;
    address: string;
    description: string;
    imgURL: string;
    creator: Types.ObjectId | string;
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

export interface PlaceDocMethodsI {
    add: (this: PlaceDocT) => Promise<any>;
    rmv: (this: PlaceDocT) => Promise<any>;
}
