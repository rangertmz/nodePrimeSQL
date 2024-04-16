import { Request, Response } from "express";
import sql from "mssql";
import dbConfig from "../../config/config";

export const deleteTable = async (req: Request, res: Response) => {
  const { databaseName, tableName } = req.body;
  let pool;
  try {
    // Establecer conexión con la base de datos
    pool = await sql.connect(dbConfig);
    //Se ejecuta la consulta
    await pool.request().query(`DROP TABLE ${databaseName}.dbo.${tableName}`);
    res
      .status(200)
      .json({ success: true, message: "Tabla eliminada exitosamente" });
    console.log("Eliminada");
  } catch (error: any) {
    console.error("Error al eliminar la Tabla:", error);
    res.status(500).json(error.message);
  }
};
