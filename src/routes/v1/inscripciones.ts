import { Router, type Request, type Response } from 'express';

const router = Router();

router.post('/', (req: Request, res: Response) => {
    const { estudianteId, materias, periodoId } = req.body;

    // 1. Corregido a .length
    // 2. Usamos el ? por seguridad (optional chaining)
    if (!estudianteId || !materias?.length || !periodoId) {
        res.status(400).json({
            error: 'Campos requeridos: estudianteId, materias, periodoId'
        });
        return; // 3. Detiene por completo la ejecución aquí
    }

    res.status(201).json({
        version: 'v1',
        estudianteId,
        materias,
        periodoId
    });
});

export default router;
