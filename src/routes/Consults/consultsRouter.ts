import express from 'express';
import { executeSql } from '../../controllers/Consults/ConsultController';
import { getCurrentDatabase } from '../../controllers/Consults/DatabaseNameController';
import { ConectDatabase } from '../../controllers/Consults/ConectDatabaseController';

const router = express.Router()

router.post('/Consults', executeSql)
router.get('/getConection', getCurrentDatabase)
router.get('/Conect/:databaseName', ConectDatabase)

export default router