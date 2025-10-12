// src/config/passport/passport.ts
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new LocalStrategy(
  { usernameField: 'username', passwordField: 'password' },
  async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) return done(null, false, { message: 'Usuário não encontrado' });
      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) return done(null, false, { message: 'Senha incorreta' });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let avatarUrl = profile.photos?.[0]?.value || null;

      if (avatarUrl) {
        avatarUrl = avatarUrl.replace(/=s\d+-c$/, '=s200-c');
      }

      const existing = await prisma.user.findFirst({
        where: { provider: 'google', email: profile.emails?.[0]?.value }
      });

      if (existing) {
        if (existing.avatarUrl !== avatarUrl) {
          const updated = await prisma.user.update({
            where: { id: existing.id },
            data: { avatarUrl }
          });
          return done(null, updated);
        }
        return done(null, existing);
      }

      const newUser = await prisma.user.create({
        data: {
          username: profile.displayName,
          email: profile.emails?.[0]?.value || '',
          passwordHash: '',
          provider: 'google',
          avatarUrl
        }
      });

      return done(null, newUser);
    } catch (err) {
      return done(err);
    }
  }
));

export default passport;
