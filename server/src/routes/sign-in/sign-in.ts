import { Router } from "express";
import bcrypt from "bcrypt";
import { users } from "../../db.ts";

const router = Router();

router.post("", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Preencha todos os campos corretamente " });
    }

    const userExists = users.find(u => u.username === username);
    if (userExists) {
      return res.status(400).json({ error: "Usuário já existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { username, password: hashedPassword };
    users.push(newUser);

    console.log("Usuário cadastrado: ", newUser);

    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (error) {
    console.error(error);
  }
})

export default router;
