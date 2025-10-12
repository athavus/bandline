import { Router } from "express";
import bcrypt from "bcrypt";
import { users } from "../../db.ts";

const router = Router();

router.post("", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(400).json({ error: "Usuário não encontrado" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Senha incorreta" });
  }

  res.json({ message: "Login bem-sucedido!" });
});

export default router;
