import { Request } from "express";
import { validationResult } from "express-validator";

import ResponseError from "../models/response-error";

export const inputValidationResult = (req: Request) => {
    const validation = validationResult(req);

    if (!validation.isEmpty()) {
        throw new ResponseError(validation.array().at(0)?.msg, 422);
    }
}