// src/config/passport/passport.ts
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from '@config//prisma/prisma';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Serialize / deserialize
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

// Local Strategy
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

// Google OAuth2 Strategy
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const existing = await prisma.user.findFirst({
        where: { provider: 'google', email: profile.emails?.[0]?.value }
      });
      if (existing) {
        return done(null, existing);
      }
      const newUser = await prisma.user.create({
        data: {
          username: profile.displayName,
          email: profile.emails?.[0]?.value || '',
          passwordHash: '', // não usado para OAuth
          provider: 'google'
        }
      });
      return done(null, newUser);
    } catch (err) {
      return done(err);
    }
  }
));

export default passport;
