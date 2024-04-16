import express from "express";
import { getTables } from "../../../src/controllers/Table/GetTablesController";
import { deleteTable } from "../../../src/controllers/Table/DeleteTableController";
import { createTable } from "../../../src/controllers/Table/CreateTableController";
import { getColumns } from "../../../src/controllers/Table/GetColumnsController";
import { updateTable } from "../../../src/controllers/Table/UpdateTableController";
import { deleteColumn } from "../../../src/controllers/Table/DeleteColumnController";

const router = express.Router();

router.get("/getTables/:databaseName", getTables);
router.get("/getColumns/:databaseName/:tableName", getColumns);
router.delete("/deleteColumn", deleteColumn);
router.post("/createTable", createTable);
router.post("/updateTable", updateTable);
router.delete("/deleteTable", deleteTable);

export default router;
