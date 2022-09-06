import axios from 'axios';

import { PlaceLocationI } from '../models/interfaces';
import ResponseError from '../models/response-error';

export const getLocationForAddress = async (address: string): Promise<PlaceLocationI> => {
    const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(
        address
    )}&apiKey=${process.env.HERE_API_KEY}`;

    const response = await axios.get(url);

    const items = response.data.items;

    if (items.length === 0) {
        throw new ResponseError(
            "invalid address, couldn't find a location for the entered address!",
            422
        );
    }

    return items[0].position;
};
