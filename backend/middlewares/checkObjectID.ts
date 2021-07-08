import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

// middleware to check for a valid object id
const checkObjectID = (idToCheck: string) => (req: Request, res: Response, next: NextFunction) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[idToCheck])) {
    return res.status(400).json({ msg: 'Invalid ID' });
  }

  return next();
};

export default checkObjectID;