
import ResponseHandler from '@src/helpers/ResponseHandler';
import { Response } from 'express';
import z, { ZodSchema } from 'zod';
export default class Validator {



  public static async validate(params: any, schema: ZodSchema, res: Response): Promise<any> {
    try {
      schema.parse(params);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ResponseHandler.error(res, error,400, 'Validation failed');
      } else {
        return ResponseHandler.error(res,error, 400, 'Validation failed');
      }
    }

  }

}