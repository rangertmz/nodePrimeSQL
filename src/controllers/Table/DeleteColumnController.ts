import { Request, Response } from "express";
import sql from "mssql";
import dbConfig from "../../../src/config/config";

interface ColumnToDelete {
  databaseName: string;
  tableName: string;
  columnName: string;
}
export const deleteColumn = async (req: Request, res: Response) => {
  const { databaseName, tableName, columnName } = req.body as ColumnToDelete;
  let pool;
  try {
    // Establecer conexión con la base de datos
    pool = await sql.connect(dbConfig);
    //Verifica si la columna existe
    const columnExistsQuery = `
      USE ${databaseName};
      SELECT COUNT(*) AS ColumnExists
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = '${tableName}' 
      AND COLUMN_NAME = '${columnName}'
    `;
    const {
      recordset: [{ ColumnExists }],
    } = await pool.request().query(columnExistsQuery);
    // La columna existe, se elimina
    if (ColumnExists === 1) {
      const deleteColumnQuery = `
        USE ${databaseName};
        ALTER TABLE ${tableName} DROP COLUMN ${columnName};
      `;
      //Se ejecuta la consulta
      await pool.request().query(deleteColumnQuery);
      res.status(200).json({
        success: true,
        message: `La columna ${columnName} ha sido eliminada correctamente de la tabla ${tableName}.`,
      });
    }
  } catch (error: any) {
    console.error("Error al eliminar la columna:", error);
    res.status(500).json(error.message);
  } finally {
    pool?.close();
  }
};
