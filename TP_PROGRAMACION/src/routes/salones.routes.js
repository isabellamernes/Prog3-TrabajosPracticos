// src/routes/salones.routes.js
import { Router } from 'express';
import { 
    getAllSalones, 
    getSalonById, 
    createSalon, 
    updateSalon, 
    deleteSalon 
} from '../controllers/salon.controller.js';

const router = Router();

router.get('/salones', getAllSalones);
router.get('/salones/:salon_id', getSalonById);
router.post('/salones', createSalon);
router.put('/salones/:salon_id', updateSalon);
router.delete('/salones/:salon_id', deleteSalon);

export default router;