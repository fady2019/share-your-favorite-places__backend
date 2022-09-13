import { Router } from 'express';

import {
    createPlace,
    deletePLace,
    getPlace,
    getUserPLaces,
    updatePlace,
} from '../controllers/places-controllers';

import { placeValidator } from '../validators/place-validator';
import { imageUploader } from '../middlewares/image-uploader-middleware';
import { tokenChecker } from '../middlewares/token-checker-middleware';

const router = Router();

// GET /places/user/:userId
// get the places of a user that has id = userId
// Need No Authentication
router.get('/user/:userId', getUserPLaces);

// GET /places/:placeId
// get the place with id = placeId
// Need No Authentication
router.get('/:placeId', getPlace);

router.use(tokenChecker());

// POST /places/new
// create a new place
// Need Authentication
router.post('/new', imageUploader('places').single('image'), placeValidator, createPlace);

// PATCH /places/:placeId
// update the place with id = placeId
// Need Authentication
router.patch('/:placeId', imageUploader('places').single('image'), placeValidator, updatePlace);

// DELETE places/:placeId
// delete the place with id = placeId
// Need Authentication
router.delete('/:placeId', deletePLace);

export default router;
