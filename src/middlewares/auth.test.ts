import { jest } from '@jest/globals';
import { type Request, type Response, type NextFunction } from 'express';
import { requireJwt } from './auth.js';


describe('Pruebas para el Verificador de API Key', () => {

  it('debe devolver error 401 si no se envia la API Key', () => {
    // Peticion vacia, sin headers
    const req = { headers: {} } as unknown as Request;
    
    // Tipamos el objeto directamente como 'any' para evitar que TS busque propiedades de Express
    const res: any = {
      statusCode: 0,
      mensajeError: '',
      status: function(codigo: number) {
        this.statusCode = codigo;
        return this;
      },
      json: function(contenido: any) {
        this.mensajeError = contenido.error || contenido.mensaje || '';
        return this;
      }
    };
    
    const next = jest.fn() as unknown as NextFunction;

    requireJwt(req, res as Response, next);

    // Comprobamos los resultados guardados
    expect(res.statusCode).toBe(401);
    expect(res.mensajeError).toBe('API key inválida o ausente');
    expect(next).not.toHaveBeenCalled();
  });

  it('debe devolver error 401 si la API Key es incorrecta', () => {
    const req = { 
      headers: { 'x-api-key': 'clave-falsa' } 
    } as unknown as Request;
    
    const res: any = {
      statusCode: 0,
      status: function(codigo: number) { 
        this.statusCode = codigo; 
        return this; 
      },
      json: function() { return this; }
    };
    
    const next = jest.fn() as unknown as NextFunction;

    requireJwt(req, res as Response, next);

    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('debe dejar pasar (llamar a next) si la API Key es correcta', () => {
    const req = { 
      headers: { 'x-api-key': 'secreto-demo' } 
    } as unknown as Request;
    
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    const next = jest.fn() as unknown as NextFunction;

    requireJwt(req, res as Response, next);

    expect(next).toHaveBeenCalled();
  });
});