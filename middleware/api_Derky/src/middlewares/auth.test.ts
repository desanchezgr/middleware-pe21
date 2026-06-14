import { jest } from '@jest/globals';
import type { Request, Response, NextFunction } from 'express';
import { verifyApiKey } from './auth.js';

describe('API Key Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    next = jest.fn();
  });

  it('debe devolver 401 si no existe x-api-key', () => {
    verifyApiKey(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('debe devolver 401 si la clave es incorrecta', () => {
    req.headers = {
      'x-api-key': 'incorrecta'
    };

    verifyApiKey(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('debe invocar next() si la clave es válida', () => {
    req.headers = {
      'x-api-key': 'secreto-demo'
    };

    verifyApiKey(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});