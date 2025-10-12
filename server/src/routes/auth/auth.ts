import { Router, Request, Response, NextFunction } from 'express';
import passport from '@config/passport/passport';
import bcrypt from 'bcryptjs';
import { prisma } from '@config/prisma/prisma';
import type { LoginRequest, RegisterRequest, AuthResponse, PublicUser } from './types';

const router = Router();

router.post('/register', async (req: Request<{}, AuthResponse, RegisterRequest>, res: Response<AuthResponse>) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Faltam campos' });
  }

  try {
    const existing = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } });
    if (existing) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, email, passwordHash, provider: 'local' }
    });

    const publicUser: PublicUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl
    };

    return res.status(201).json({ message: 'Usuário criado', user: publicUser });
  } catch {
    return res.status(500).json({ message: 'Erro no servidor' });
  }
});

router.post('/login', (req: Request<{}, AuthResponse, LoginRequest>, res: Response<AuthResponse>, next: NextFunction) => {
  passport.authenticate('local', (err, user, info) => {
    console.log({ err, user, info });
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info?.message || 'Credenciais inválidas' });
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      const publicUser: PublicUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl
      };
      return res.json({ message: 'Login bem-sucedido', user: publicUser });
    });
  })(req, res, next);
});

router.get('/me', (req: Request, res: Response<{ user: PublicUser } | { error: string }>) => {
  if (req.isAuthenticated()) {
    const u = req.user as any;
    const publicUser: PublicUser = {
      id: u.id,
      username: u.username,
      email: u.email,
      avatarUrl: u.avatarUrl
    };
    return res.json({ user: publicUser });
  }
  return res.status(401).json({ error: 'Não autenticado' });
});

router.post('/logout', (req: Request, res: Response<AuthResponse>) => {
  req.logout(err => {
    if (err) {
      return res.status(500).json({ message: 'Erro no logout' });
    }
    return res.json({ message: 'Logout realizado com sucesso' });
  });
});

// GOOGLE OAUTH
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/auth/login-failed',
  successRedirect: '/auth/login-success'
}));

router.get('/login-success', (req, res: Response<AuthResponse>) => {
  const u = req.user as any;
  const publicUser: PublicUser = {
    id: u.id,
    username: u.username,
    email: u.email,
    avatarUrl: u.avatarUrl
  };
  return res.json({ message: 'Login OAuth2 bem-sucedido', user: publicUser });
});

router.get('/login-failed', (req, res: Response<{ error: string }>) =>
  res.status(401).json({ error: 'Falha no login OAuth2' })
);

export default router;
