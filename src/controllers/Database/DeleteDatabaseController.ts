import { Request, Response } from "express";
import sql from "mssql";
import dbConfig from "../../config/config";

export const deleteDatabase = async (req: Request, res: Response) => {
  const { databaseName } = req.body;
  let pool;
  try {
    // Establecer conexión con la base de datos
    pool = await sql.connect(dbConfig);
    //Construir la consulta para eliminar la base de datos
    await pool
      .request()
      .query(`SELECT name FROM sys.databases WHERE name = '${databaseName}'`);
      //Ejecuta la consulta
    await pool.request().query(`DROP DATABASE ${databaseName}`);
    res
      .status(200)
      .json({ success: true, message: "Base de datos eliminada exitosamente" });
    console.log("Eliminada");
  } catch (error: any) {
    if (error.number === 3701) {
      // Error number for "database does not exist"
      return res.status(404).json("La base de datos no existe");
    }
    console.error("Error al eliminar la base de datos:", error);
    res.status(500).json(error.message);
  }
};
