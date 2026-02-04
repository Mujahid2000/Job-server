// VerificationMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized access: No token provided.' });
  }
 console.log(authHeader)
 
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized access: Malformed token.' });
  }

  jwt.verify(token, process.env.SECRET_TOKEN as any, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized access: Invalid token.' });
    }
    (req as any).decoded = decoded;
    next();
  });
};

// ✅ Correct export
export default verifyToken;
