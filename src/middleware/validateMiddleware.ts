import { NextFunction, Request, Response } from 'express';
import { ZodObject, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

const validate = (schema: ZodObject<any, any>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessage = error.issues
        .map((details: any) => details.message)
        .join(', ');
      return next(new ApiError(400, errorMessage));
    }
    return next(error);
  }
};

export default validate;
