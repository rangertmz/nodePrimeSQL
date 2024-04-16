import { Request, Response } from "express";
import sql from "mssql";
import dbConfig from "../../config/config";

export const deleteData = async (req: Request, res: Response) => {
  const { databaseName, tableName } = req.params;
  const { ...conditions } = req.query;
  let pool;
  try {
    // Establecer conexión con la base de datos
    pool = await sql.connect(dbConfig);
    console.log(tableName);
    // Construir la consulta SQL para eliminar el registro
    let deleteQuery = `USE ${databaseName}; DELETE FROM ${tableName} WHERE `;
    Object.entries(conditions).forEach(([column, value], index) => {
      if (index > 0) {
        deleteQuery += " AND ";
      }
      deleteQuery += `${column} = '${value}'`;
    });
    // Ejecutar la consulta para eliminar el registro
    const result = await pool.request().query(deleteQuery);
    // Verificar si se eliminó el registro correctamente
    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: "Registro eliminado correctamente" });
    } else {
      res.status(404).json({ error: "Registro no encontrado" });
    }
  } catch (error: any) {
    console.error("Error al eliminar el registro:", error);
    res.status(500).json(error.message);
  } 
};
