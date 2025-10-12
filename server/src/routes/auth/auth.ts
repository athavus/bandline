
import { Router } from "express";
import passport from "@config/passport/passport";
import bcrypt from "bcryptjs";
import { prisma } from "@config/prisma/prisma";

const router = Router();

// ======== REGISTER LOCAL ========
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: "Faltam campos" });

  try {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (existing) return res.status(400).json({ error: "Usuário já existe" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, email, passwordHash, provider: "local" },
    });

    res.status(201).json({ message: "Usuário criado", user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// ======== LOGIN LOCAL ========
router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ message: "Login bem-sucedido", user: req.user });
});

// ======== LOGIN GOOGLE ========
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", {
  failureRedirect: "/auth/login-failed",
  successRedirect: "/auth/login-success",
}));

router.get("/login-success", (req, res) => res.json({ message: "Login OAuth2 bem-sucedido", user: req.user }));
router.get("/login-failed", (req, res) => res.status(401).json({ error: "Falha no login OAuth2" }));

export default router;
