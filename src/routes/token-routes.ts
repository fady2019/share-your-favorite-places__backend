import { Router } from 'express';
import { refreshToken } from '../utilities/token-utility';

const router = Router();

// token/refresh
router.post('/refresh', (req, res, _next) => {
    const token = refreshToken(req.headers.authorization);
    res.json({ token });
});

export default router;
