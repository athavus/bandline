import { Router } from "express";
import fetch from 'node-fetch';
import dotenv from 'dotenv';

import token from '../token.ts';

dotenv.config();

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const response = await fetch("https://api.spotify.com/v1/artists/06HL4z0CvFAxyc27GXpf02", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      },
    });

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Não foi possível conseguir o artista do spotify" });
  }
});

export default router;
