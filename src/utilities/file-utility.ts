import fs from 'fs';
import path from 'path';
import { NextFunction } from 'express';

import { rootPath } from './path-utility';

const deletableDirs = ['media'];

export const deleteFile = (filePath: string, next?: NextFunction) => {
    const filePathParts = path
        .normalize(filePath)
        .split(path.sep)
        .filter((part) => part.trim() !== '');

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
