import fs from 'fs';
import path from 'path';
import { NextFunction } from 'express';

import { getPathParts, rootPath } from './path-utility';

const mediaPath = process.env.MEDIA_DIR_PATH as string;
const mediaPathPrefix = getPathParts(mediaPath)[0];
const deletableDirs = [mediaPathPrefix];

export const deleteFile = (filePath: string, next?: NextFunction) => {
    const filePathParts = getPathParts(filePath);

    const filePathPrefix = filePathParts[0];

    if (filePathParts.length < 2 || deletableDirs?.indexOf(filePathPrefix) === -1) {
        return;
    }

    const absPath = path.join(rootPath, filePath);

    fs.rm(absPath, { recursive: true, force: true }, (error) => {
        if (next) {
            next(error);
        }
    });
};
