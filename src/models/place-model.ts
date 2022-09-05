import { model, Schema } from 'mongoose';

const placeSchema = new Schema(
    {
        title: {
            type: String,
            require: true,
        },
        description: {
            type: String,
            require: true,
        },
        address: {
            type: String,
            require: true,
        },
        imgURL: {
            type: String,
            require: true,
        },
        location: {
            type: {
                lat: Number,
                lng: Number,
            },
            require: true,
        },
        creator: {
            type: Schema.Types.ObjectId,
            require: true,
        },
    },
    {
        timestamps: true,
    }
);

const Place = model('Place', placeSchema);

export default Place;
