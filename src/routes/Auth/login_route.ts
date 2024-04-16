import express from 'express';
import { authenticateUser } from '../../controllers/Auth/login_controller'; 

const router = express.Router();

router.post('/login', authenticateUser);

export default router;