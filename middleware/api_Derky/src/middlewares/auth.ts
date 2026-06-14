import type { Request, Response, NextFunction } from 'express';

export function verifyApiKey(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const apiKey = req.headers['x-api-key'];

  if (apiKey !== 'secreto-demo') {
    res.status(401).json({
      error: 'API key inválida o ausente'
    });
    return;
  }

  next();
}