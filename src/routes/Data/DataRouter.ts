import express from "express";
import { getData } from "../../controllers/Data/GetDataController";
import { deleteData } from "../../controllers/Data/DeleteDataController";
import { createData } from "../../controllers/Data/CreateDataController";
import { updateData } from "../../controllers/Data/UpdateDataController";

const router = express.Router();

router.get('/GetData/:databaseName/:tableName', getData)
router.delete('/deleteData/:databaseName/:tableName', deleteData);
router.post('/createData', createData)
router.post('/updateData', updateData)

export default router
