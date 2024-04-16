import { Request, Response } from "express";
import sql, { Request as MSSQLRequest } from "mssql";
import dbConfig from "../../config/config";

interface UpdateData {
  databaseName: string;
  tableName: string;
  columns: string[];
  data: any[];
}

export const updateData = async (req: Request, res: Response) => {
  const { databaseName, tableName, columns, data }: UpdateData = req.body;
  try {
    // Validar los datos recibidos
    if (!databaseName || !tableName || !columns || !data) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }
    // Establecer conexión con la base de datos
    await sql.connect(dbConfig);
    // Crear una nueva instancia de la clase Request de mssql
    const request: MSSQLRequest = new sql.Request();
    // Construir la consulta SQL de actualización
    let query = `UPDATE ${databaseName}.dbo.${tableName} SET `;
    columns.slice(1).forEach((column, index) => {
      query += `${column} = @param${index + 1}`;
      if (index < columns.length - 2) {
        query += ", ";
      }
      request.input(`param${index + 1}`, data[index + 1]);
    });
    // Agregar la condición WHERE usando la primera columna como identificador
    query += ` WHERE ${columns[0]} = @param${columns.length}`;
    // Agregar el parámetro para la condición WHERE
    request.input(`param${columns.length}`, data[0]);
    // Ejecutar la consulta SQL
    await request.query(query);
    res.status(200).json({ message: "Registro actualizado exitosamente" });
  } catch (error: any) {
    console.error("Error al actualizar el registro:", error);
    res.status(500).json(error.message);
  }
};
