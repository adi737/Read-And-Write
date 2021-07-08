import { RequestExt } from 'backend/interfaces';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware = (req: RequestExt, res: Response, next: NextFunction) => {
  const token = req.header('auth-token');

  if (!token) {
    return res.status(401).json({
      msg: 'Authentication denied, no token'
    });
  }

  const secret = process.env.SECRET_LOGIN!;

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        msg: 'Authentication denied, invalid token'
      });
    }
    req.user = decoded;

    return next();
  });

  return;
}

export default authMiddleware;