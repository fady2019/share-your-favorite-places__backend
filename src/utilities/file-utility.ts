import fs from 'fs';
import path from 'path';
import { NextFunction } from 'express';

import { rootPath } from './path-utility';

export const deleteFile = (filePath: string, next?: NextFunction) => {
    const absPath = path.join(rootPath, filePath);

    fs.unlink(absPath, (error) => {
        if (next) {
            next(error);
        }
    });
};
