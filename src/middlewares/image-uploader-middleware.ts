import path from 'path';
import fs from 'fs';
import multer from 'multer';

import { rootPath } from '../utilities/path-utility';
import ResponseError from '../models/response-error';

export const imageUploader = (imgPath: string) => {
    return multer({
        storage: multer.diskStorage({
            destination(req, _file, callback) {
                const userId = req.user?.id;

                if (!userId) {
                    return callback(new ResponseError('user id is required!', 422), '');
                }

                const mediaPath = path.join('media', userId, 'images', imgPath);
                const destPath = path.join(rootPath, mediaPath);

                fs.mkdir(destPath, { recursive: true }, (error) => {
                    callback(error, mediaPath);
                });
            },
            filename(_req, file, callback) {
                const filename = `${Date.now()}-${file.originalname}`;

                callback(null, filename);
            },
        }),
        fileFilter(_req, file, callback) {
            const fileType = file.mimetype;

            if (fileType === 'image/png' || fileType === 'image/jpeg' || fileType === 'image/jpg') {
                callback(null, true);
            } else {
                callback(
                    new ResponseError('invalid image, only png, jpg, and jpeg images are accepted!', 422)
                );
            }
        },
    });
};
