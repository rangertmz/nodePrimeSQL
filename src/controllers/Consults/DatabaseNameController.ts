import { Request, Response } from "express";
import sql from "mssql";
import dbConfig from "../../config/config";

export const getCurrentDatabase = async (req: Request, res: Response) => {
  let pool;
  try {
    // Conectarse a la base de datos maestra
    pool = await sql.connect(dbConfig);
    // Consultar el nombre de la base de datos actual
    const result = await pool
      .request()
      .query("SELECT DB_NAME() AS CurrentDatabase");
    
    // Extraer el nombre de la base de datos actual del resultado
    const currentDatabase = result.recordset[0].CurrentDatabase;
    //Devuelve el nombre de la base de datos
    res.json(currentDatabase);
  } catch (error) {
    console.error("Error al obtener la base de datos actual:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
