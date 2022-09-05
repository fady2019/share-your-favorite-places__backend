import { Router } from 'express';

import {
    createPlace,
    deletePLace,
    getPlace,
    getUserPLaces,
    updatePlace,
} from '../controllers/places-controllers';

import { placeValidator } from '../validators/place-validator';

const router = Router();

// GET /places/user/:userId
// get the places of a user that has id = userId
router.get('/user/:userId', getUserPLaces);

// POST /places/new
// create a new place
router.post('/new', placeValidator, createPlace);

// GET /places/:placeId
// get the place with id = placeId
router.get('/:placeId', getPlace);

// PATCH /places/:placeId
// update the place with id = placeId
router.patch('/:placeId', updatePlace);

// DELETE places/:placeId
// delete the place with id = placeId
router.delete('/:placeId', deletePLace);

export default router;
