import { Request, Response } from "express";
import sql from "mssql";
import dbConfig from "../../../src/config/config";

interface ModifiedColumn {
  oldColumnName?: string;
  columnName?: string;
  dataType?: string;
  maxLength?: number | null;
  isNullable?: boolean;
  isIdentity?: boolean;
  isPrimaryKey?: boolean;
}
export const updateTable = async (req: Request, res: Response) => {
  const { databaseName, tableName, modifiedColumns, newTableName } = req.body;
  let pool;
  try {
    pool = await sql.connect(dbConfig);
    let updatedTableName = tableName;
    // Modificar el nombre de la tabla si se proporciona
    if (newTableName) {
      await pool
        .request()
        .query(
          `USE ${databaseName}; EXEC sp_rename '${tableName}', '${newTableName}';`
        );
      updatedTableName = newTableName;
    }
    // Modificar las columnas
    for (const column of modifiedColumns) {
      const { oldColumnName, columnName, dataType, maxLength, isNullable } =
        column;
      // Verificar si la columna existente tiene el mismo nombre
      const columnExistsQuery = `
        USE ${databaseName};
        SELECT COUNT(*) AS ColumnExists
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = '${newTableName || tableName}' 
        AND COLUMN_NAME = '${oldColumnName}'
      `;
      const {
        recordset: [{ ColumnExists }],
      } = await pool.request().query(columnExistsQuery);
      if (ColumnExists === 1) {
        // Cambiar el nombre de la columna si es diferente
        if (oldColumnName !== columnName) {
          await pool
            .request()
            .query(
              `USE ${databaseName}; EXEC sp_rename '${tableName}.${oldColumnName}', '${columnName}', 'COLUMN';`
            );
        }
        // Modificar el tipo de datos y la longitud de la columna
        const modifyColumnQuery = `
          USE ${databaseName};
          ALTER TABLE ${
            newTableName || tableName
          } ALTER COLUMN ${columnName} ${dataType}${
          maxLength ? `(${maxLength})` : ""
        }${
          isNullable !== undefined ? ` ${isNullable ? "NULL" : "NOT NULL"}` : ""
        };
        `;
        await pool.request().query(modifyColumnQuery);
      } else {
        // Si la columna no existe, agregarla a la tabla
        const addColumnQuery = `
          USE ${databaseName};
          ALTER TABLE ${
            newTableName || tableName
          } ADD ${columnName} ${dataType}${maxLength ? `(${maxLength})` : ""}${
          isNullable !== undefined ? ` ${isNullable ? "NULL" : "NOT NULL"}` : ""
        };
        `;
        await pool.request().query(addColumnQuery);
      }
    }

    res.status(200).json({
      success: true,
      message: "Tabla y columnas modificadas correctamente",
    });
  } catch (error: any) {
    console.error("Error al modificar la tabla y las columnas:", error.message);
    res.status(500).json(error.message);
  } finally {
    pool?.close();
  }
};
