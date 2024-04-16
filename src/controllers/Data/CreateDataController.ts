import { Request, Response } from "express";
import sql, { Request as MSSQLRequest } from "mssql";
import dbConfig from "../../config/config";

interface NewRecordData {
  databaseName: string;
  tableName: string;
  columns: string[];
  data: any[];
}

export const createData = async (req: Request, res: Response) => {
  const { databaseName, tableName, columns, data }: NewRecordData = req.body;
  try {
    // Validar los datos recibidos
    if (!databaseName || !tableName || !columns || !data) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }
    // Establecer conexión con la base de datos
    await sql.connect(dbConfig);
    // Crear una nueva instancia de la clase Request de mssql
    const request: MSSQLRequest = new sql.Request();
    // Construir la consulta SQL con parámetros de consulta
    const columnNames = columns.join(",");
    const valuePlaceholders = data
      .map((_, index) => `@param${index + 1}`)
      .join(",");
    const query = `INSERT INTO ${databaseName}.dbo.${tableName} (${columnNames}) VALUES (${valuePlaceholders})`;
    // Agregar los parámetros nombrados al objeto de solicitud
    data.forEach((value, index) => {
      request.input(`param${index + 1}`, value);
    });
    // Ejecuta la consulta
    await request.query(query);
    res.status(200).json({ message: "Registro creado exitosamente" });
  } catch (error: any) {
    console.error("Error al crear el registro:", error);
    res.status(500).json(error.message);
  }
};
