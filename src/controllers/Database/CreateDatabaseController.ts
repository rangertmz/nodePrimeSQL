import { Request, Response } from "express";
import sql from "mssql";
import dbConfig from "../../config/config";

export const createDatabase = async (req: Request, res: Response) => {
  const { databaseName, collation } = req.body;
  let pool;
  try {
    // Establecer conexión con la base de datos
    pool = await sql.connect(dbConfig);
    //Construir consulta para crear la base de datos
    const result = await pool
      .request()
      .query(`SELECT name FROM sys.databases WHERE name = '${databaseName}'`);
    //Si existe la base de datos
    if (result.recordset.length > 0) {
      return res
        .status(400)
        .json("Ya existe una base de datos con el mismo nombre");
    }
    //Si la base de datos no existe se crea
    await pool
      .request()
      .query(`CREATE DATABASE ${databaseName} COLLATE ${collation}`);
    res
      .status(200)
      .json({ success: true, message: "Base de datos creada exitosamente" });
    console.log("creada");
  } catch (error: any) {
    console.error("Error al crear la base de datos:", error);
    res.status(500).json(error.message);
  }
};
