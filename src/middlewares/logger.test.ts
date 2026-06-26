import { jest, expect, describe, it, beforeEach, afterEach } from '@jest/globals';
import type { Request, Response, NextFunction } from 'express';
import { requestLogger } from './logger.js';

describe('Logger Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;
  
  let consoleSpy: ReturnType<typeof jest.spyOn>; 

  beforeEach(() => {
    mockRequest = {
      method: 'GET',
      url: '/api/v1/users',
      path: '/api/v1/users', // Añadido por si tu middleware usa req.path en vez de req.url
    };

    // Corregimos el mockResponse para que tenga la función .on()
    mockResponse = {
      statusCode: 200,
      on: jest.fn((event: string, callback: () => void) => {
        // Si el middleware escucha el evento 'finish', ejecutamos el callback inmediatamente
        if (event === 'finish') {
          callback();
        }
        return mockResponse as Response;
      }) as any
    };

    nextFunction = jest.fn() as unknown as NextFunction;
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('debe invocar next() correctamente al recibir una petición', () => {
    requestLogger(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledTimes(1);
  });

  it('debe registrar el método y la ruta correctamente', () => {
    requestLogger(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('GET')
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/users')
    );
  });
});