import express from 'express';
import { createDatabase } from '../../controllers/Database/CreateDatabaseController';
import { getDatabases} from '../../controllers/Database/GetDatabaseController';
import { deleteDatabase } from '../../controllers/Database/DeleteDatabaseController';
import { updateDatabase } from '../../controllers/Database/UpdateDatabaseController-';

const router = express.Router();

router.post('/createDatabase', createDatabase);
router.get('/getDatabase', getDatabases);
router.delete('/deleteDatabase', deleteDatabase);
router.post('/UpdateDatabase', updateDatabase)

export default router;
