import { Router, type Request, type Response } from 'express';

const router = Router();
const METODOS_PAGO = ['debit', 'credit', 'scholarship'] as const;

// Post: estudianteId, materias(Arreglo), periodoId, metodo_pago - Registrar matricula
router.post('/', (req: Request, res: Response) => {
  const { estudianteId, materias, periodoId, payment_method } = req.body;


    // 1. Validar que existan todos los campos obligatorios (Corregido .length)
  if (!estudianteId || !materias?.length || !periodoId || !payment_method) {
    res.status(400).json({ error: 'Campos requeridos: estudianteId, materias, periodoId, payment_method' });
    return;
  }

    
    // 2. Validar que el método de pago sea permitido (Agregadas llaves y return)
  if (!METODOS_PAGO.includes(payment_method)) {
    res.status(400).json({ error: 'payment_method inválido. Valores: debit, credit, scholarship' });
    return;
  }

  res.status(201).json({ version: 'v2', estudianteId, materias, periodoId, payment_method });
});

export default router;
