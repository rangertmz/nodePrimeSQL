import { Request, Response } from "express";
import sql from "mssql";
import dbConfig from "../../config/config";


export const getTables = async (req: Request, res: Response) => {
  const { databaseName } = req.params;
  let pool;
  try {
    // Establecer conexión con la base de datos
    pool = await sql.connect(dbConfig);
    //Construir consulta para obtener las tablas
    const result = await pool
      .request()
      .query(
        `SELECT TABLE_NAME 
        FROM ${databaseName}.INFORMATION_SCHEMA.TABLES 
        ;`
      );
    //Se obtienen unicamente los nombres
    const tables = result.recordset.map((row: any) => row.TABLE_NAME);
    res.json({ tables });
  } catch (error) {
    console.error("Error al obtener las tablas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
