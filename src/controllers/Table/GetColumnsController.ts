import { Request, Response } from "express";
import sql from "mssql";
import dbConfig from "../../../src/config/config";

interface TableColumn {
  columnName: string;
  dataType: string;
  maxLength: number | null;
  isNullable: boolean;
  isIdentity: boolean;
  isPrimaryKey: boolean;
}
export const getColumns = async (req: Request, res: Response) => {
  const { databaseName, tableName } = req.params;
  let pool;
  try {
    // Establecer conexión con la base de datos
    pool = await sql.connect(dbConfig);
    //Construir consulta
    const query = `
            USE ${databaseName};
            SELECT 
                c.COLUMN_NAME,
                c.DATA_TYPE,
                c.CHARACTER_MAXIMUM_LENGTH AS MAX_LENGTH,
                c.IS_NULLABLE,
                COLUMNPROPERTY(OBJECT_ID(CONCAT('${databaseName}.dbo.', c.TABLE_NAME)), c.COLUMN_NAME, 'IsIdentity') AS IS_IDENTITY,
                ISNULL((SELECT 1 FROM ${databaseName}.INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_NAME = c.TABLE_NAME AND COLUMN_NAME = c.COLUMN_NAME), 0) AS IS_PRIMARY_KEY
            FROM ${databaseName}.INFORMATION_SCHEMA.COLUMNS c
            WHERE c.TABLE_NAME = @tableName;
        `;
    //Ejecuta la consulta
    const result = await pool
      .request()
      .input("tableName", sql.NVarChar, tableName)
      .query(query);
    //Se asigna los datos en la Interfaz
    const columns: TableColumn[] = result.recordset.map((row: any) => ({
      columnName: row.COLUMN_NAME,
      dataType: row.DATA_TYPE,
      maxLength: row.MAX_LENGTH,
      isNullable: row.IS_NULLABLE === "YES",
      isIdentity: !!row.IS_IDENTITY,
      isPrimaryKey: !!row.IS_PRIMARY_KEY,
    }));

    res.status(200).json({ success: true, columns });
  } catch (error) {
    console.error("Error al obtener las columnas de la tabla:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
};
