
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "@config/prisma/prisma";
import bcrypt from "bcryptjs";


passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) return done(null, false, { message: "Usuário não encontrado" });

      const valid = await bcrypt.compare(password, user.passwordHash || "");
      if (!valid) return done(null, false, { message: "Senha incorreta" });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({ where: { providerId: profile.id } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              username: profile.displayName,
              email: profile.emails?.[0].value || "",
              provider: "google",
              providerId: profile.id,
            },
          });
        }

        done(null, user);
      } catch (err) {
        done(err as any);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err as any);
  }
});

export default passport;
