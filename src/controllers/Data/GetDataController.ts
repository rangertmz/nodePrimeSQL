import { Request, Response } from "express";
import sql from "mssql";
import dbConfig from "../../config/config";

export const getData = async (req: Request, res: Response) => {
  const { databaseName, tableName } = req.params;
  let pool;
  try {
    pool = await sql.connect(dbConfig);
    const columnsResult = await pool
      .request()
      .query(
        `USE ${databaseName}; SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}';`
      );
    const columns = columnsResult.recordset.map((row: any) => row.COLUMN_NAME);
    // Si no hay datos en la tabla, devolver solo las columnas
    if (columns.length === 0) {
      res.json({ columns });
      return;
    }
    // Consultar los datos de la tabla
    const dataResult = await pool
      .request()
      .query(`USE ${databaseName}; SELECT * FROM ${tableName};`);
    const data = dataResult.recordset;
    res.json({ data, columns });
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
