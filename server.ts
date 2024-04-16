import express, { Request, Response } from "express";
import sql from "mssql";
import cors from "cors";
import authRoute from "./src/routes/Auth/login_route";
import dbConfig from "./src/config/config";
import dbRoute from "./src/routes/Database/databaseRouter";
import ConsultsRoute from "./src/routes/Consults/consultsRouter";
import tbRoute from "./src/routes/Table/tableRouter";
import DtRoute from "./src/routes/Data/DataRouter";

sql
  .connect(dbConfig)
  .then(() => {
    console.log("Conexión a SQL Server establecida correctamente");
  })
  .catch((error) => {
    console.error("Error al establecer la conexión a SQL Server 2:", error);
  });

const app = express();
app.use(cors());
app.use(express.json());

//Auth
app.post("/login", authRoute);
//Database
app.post("/createDatabase", dbRoute);
app.delete("/deleteDatabase", dbRoute);
app.post("/UpdateDatabase", dbRoute);
//GET DBs
app.get("/getDatabase", dbRoute);
//Consults
app.post("/Consults", ConsultsRoute);
//GET Conection
app.get("/getConection", ConsultsRoute);
//Conect Db
app.get("/Conect/:databaseName", ConsultsRoute);
//Table
app.post("/createTable", tbRoute);
app.post("/updateTable", tbRoute);
app.delete("/deleteTable", tbRoute);
//GET TBS
app.get("/getTables/:databaseName", tbRoute);
//GET COLs
app.get("/getColumns/:databaseName/:tableName", tbRoute);
//Delete Columns
app.delete("/deleteColumn", tbRoute);
//GetData
app.get("/getData/:databaseName/:tableName", DtRoute);
//Data
app.post("/createData", DtRoute);
app.post("/updateData", DtRoute);
app.delete("/deleteData/:databaseName/:tableName", DtRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor backend iniciado en el puerto ${PORT}`);
});
