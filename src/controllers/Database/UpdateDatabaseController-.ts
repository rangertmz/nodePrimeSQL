import { Request, Response } from "express";
import sql from "mssql";
import dbConfig from "../../config/config";

export const updateDatabase = async (req: Request, res: Response) => {
  const { database, name, collation } = req.body;
  try {
    // Establecer conexión con la base de datos
    const pool = await sql.connect(dbConfig);
    // Verificar si la base de datos existe
    const databaseExistenceQuery = `
      SELECT COUNT(*) AS count
      FROM sys.databases
      WHERE name = '${database}';
    `;
    const existenceResult = await pool
      .request()
      .input("database", sql.VarChar, name)
      .query(databaseExistenceQuery);
    const databaseExists = existenceResult.recordset[0].count > 0;
    if (!databaseExists) {
      return res.status(404).json({ error: "La base de datos no existe." });
    }
    //Si collation existe se actualiza
    if (collation) {
      const updateQuery = `
      ALTER DATABASE ${database}
      COLLATE ${collation};
    `;
      await pool.request().query(updateQuery);
    }
    //Si el nombre existe se actualiza
    if (name) {
      const renameQuery = `
        ALTER DATABASE ${database}
        MODIFY NAME = ${name};
      `;
      await pool.request().query(renameQuery);
    }
    return res
      .status(200)
      .json({ message: "Base de datos actualizada correctamente." });
  } catch (error: any) {
    console.error("Error al modificar la base de datos:", error);
    return res.status(500).json(error.message);
  }
};
