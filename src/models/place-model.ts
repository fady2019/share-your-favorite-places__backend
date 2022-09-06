import { model, Schema } from 'mongoose';

const placeSchema = new Schema(
    {
        title: String,
        description: String,
        address: String,
        imgURL: String,
        location: {
            _id: false,
            lat: Number,
            lng: Number,
        },
        creator: Schema.Types.ObjectId,
    },
    {
        timestamps: true,
    }
);

const Place = model('Place', placeSchema);

export default Place;
