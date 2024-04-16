import { Request, Response } from "express";
import sql from "mssql";
import dbConfig from "../../config/config";

export const ConectDatabase = async (req: Request, res: Response) => {
  const { databaseName } = req.params;
  let pool;
  try {
    pool = await sql.connect(dbConfig);

    await pool.request().query(`USE ${databaseName};`);
  } catch (error) {
    console.error("Error al conectarse:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
