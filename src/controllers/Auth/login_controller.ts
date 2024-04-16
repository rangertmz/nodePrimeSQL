import { Request, Response } from "express";
import sql from "mssql";
import dbConfig from "../../config/config";

export const authenticateUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    if (username === dbConfig.user && password === dbConfig.password) {
      // Autenticación exitosa
      res.status(200).json({ success: true });
    } else {
      // Autenticación fallida
      res.status(401).json("Credenciales incorrectas");
    }
  } catch (e: any) {
    res.status(400).json(e.message);
  }
};
