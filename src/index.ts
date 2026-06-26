import  express, {type Request,type Response,type NextFunction } from 'express';
import { requestLogger } from './middlewares/logger.js';
import { requireJwt } from './middlewares/auth.js';   // Importa el nuevo middleware
import { rateLimiter } from './middlewares/rateLimiter.js'; // Importa el nuevo limitador
import v1Inscripciones from './routes/v1/inscripciones.js';
import v2Inscripciones from './routes/v2/inscripciones.js';

const app = express(); // Primero la declaración

// Pipeline en orden (de arriba a abajo)
app.use(express.json());   
app.use(requestLogger);    
app.use(requireJwt);       
app.use(rateLimiter);      

// Rutas
app.use('/v1/inscripciones', v1Inscripciones);
app.use('/v2/inscripciones', v2Inscripciones);

// Manejador de errores básico
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(3000, () => console.log('Servidor en puerto 3000'));