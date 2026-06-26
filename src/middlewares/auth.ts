import type { Request, Response, NextFunction } from 'express';
import { createHmac, timingSafeEqual } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET ?? '';

function base64UrlDecode(str: string): string {
  return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
}

export function requireJwt(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'] ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) return res.status(401).json({ error: 'Token ausente' });

  const parts = token.split('.');
  if (parts.length !== 3) return res.status(401).json({ error: 'Token malformado' });

  const [headerB64, payloadB64, signatureB64] = parts as [string, string, string];

  try {
    // 1. Validar algoritmo
    const header = JSON.parse(base64UrlDecode(headerB64));
    if (header.alg !== 'HS256') {
      return res.status(401).json({ error: 'Algoritmo no permitido' });
    }

    // 2. Verificar firma
    const expectedSig = createHmac('sha256', JWT_SECRET)
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64url');

    if (!timingSafeEqual(Buffer.from(signatureB64), Buffer.from(expectedSig))) {
      return res.status(401).json({ error: 'Firma invalida' });
    }

    // 3. Validar claims (expiración y sub)
    const claims = JSON.parse(base64UrlDecode(payloadB64));
    const now = Math.floor(Date.now() / 1000);
    
    if (claims.exp && claims.exp < now) {
      return res.status(401).json({ error: 'Token expirado' });
    }
    if (!claims.sub) {
      return res.status(401).json({ error: 'Claim sub ausente' });
    }

    // Guardar datos y continuar
    (req as Request & { user?: unknown }).user = { sub: claims.sub, scope: claims.scope ?? '' };
    next();

  } catch (err) {
    // Si JSON.parse o Buffer fallan, el token es inválido
    return res.status(401).json({ error: 'Token inválido' });
  }
}