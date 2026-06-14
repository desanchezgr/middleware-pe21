import type { Request, Response, NextFunction } from 'express';
import { logger } from './logger.js';
import { jest } from '@jest/globals';

describe('Logger Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    mockRequest = {
      method: 'GET',
      url: '/api/v1/users',
    };

    mockResponse = {};
    nextFunction = jest.fn();

    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('debe invocar next() correctamente al recibir una petición', () => {
    logger(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledTimes(1);
  });

  it('debe registrar el método y la ruta correctamente', () => {
    logger(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('GET')
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/users')
    );
  });
});