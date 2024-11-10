import { Request, Response, NextFunction } from 'express';

export function removeNullPrototype(req: Request, res: Response, next: NextFunction): void {
  req.body = Object.assign({}, req.body);
  next();
}

export default {
  removeNullPrototype,
};
