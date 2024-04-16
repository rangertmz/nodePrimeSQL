import { Request, Response } from 'express';
import sql from 'mssql';
import dbConfig from '../../config/config';

export const executeSql = async (req: Request, res: Response) => {
    const { consult } = req.body; // Obtener la consulta SQL del cuerpo de la solicitud
    let pool;

    try {
        // Conectar a la base de datos
        pool = await sql.connect(dbConfig);
      
        // Ejecutar la consulta SQL
        const result = await pool.request().query(consult);
        if (result && result.recordset && result.recordset.length > 0) {
          // Si la consulta es un SELECT y devuelve resultados
          res.status(200).json(result.recordset);
          
      } else {
          // Si la consulta es un SELECT pero no devuelve resultados
          res.status(200).json({ message: 'Commands completed successfully.', completionTime: 'Completion time: '+new Date().toISOString() });
      }
    } catch (error:any) {
        
        res.status(500).json({ success: false, error: error.message, completionTime: 'Completion time : '+new Date().toISOString() });
    } 
};
