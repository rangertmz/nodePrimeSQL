import { Request, Response } from "express";
import sql from "mssql";
import dbConfig from "../../config/config";

export const getDatabases = async (req: Request, res: Response) => {
  let pool;
  try {
    // Establecer conexión con la base de datos
    pool = await sql.connect(dbConfig);
    //Contruir la consulta para obtener las bases de datos
    const result = await pool.request().query(`
    SELECT name, collation_name
    FROM sys.databases
  `);
    //Se hace un mapeo para obtener los nombres y sus collations
    const databases = result.recordset.map((row: any) => ({
      name: row.name,
      collation: row.collation_name,
    }));
    res.json({ databases });
  } catch (error) {
    console.error("Error al obtener la lista de bases de datos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
