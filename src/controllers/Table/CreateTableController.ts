import { Request, Response } from "express";
import sql from "mssql";
import dbConfig from "../../config/config";

interface TableField {
  columnName: string;
  dataType: string;
  maxLength?: number;
  isNullable: boolean;
  isPrimaryKey: boolean;
  isIdentity?: boolean;
}
export const createTable = async (req: Request, res: Response) => {
  const { databaseName, tableName, fields } = req.body;
  let pool;
  try {
    // Establecer conexión con la base de datos
    pool = await sql.connect(dbConfig);
    // Construir la consulta SQL para crear la tabla
    let query = `CREATE TABLE ${databaseName}.dbo.${tableName} (`;
    query += fields
      .map((field: TableField) => {
        let fieldQuery = `${field.columnName} ${field.dataType}`;
        if (field.maxLength) {
          fieldQuery += `(${field.maxLength})`;
        }
        if (!field.isNullable) {
          fieldQuery += " NOT NULL";
        }
        if (field.isPrimaryKey) {
          fieldQuery += " PRIMARY KEY";
        }
        if (field.isIdentity) {
          fieldQuery += " IDENTITY(1,1)";
        }
        return fieldQuery;
      })
      .join(",");
    query += ");";
    // Ejecutar la consulta para crear la tabla
    await pool.request().query(query);
    res
      .status(200)
      .json({ success: true, message: "Tabla creada exitosamente" });
  } catch (error: any) {
    console.error("Error al crear la tabla:", error);
    res.status(500).json(error.message);
  }
};
