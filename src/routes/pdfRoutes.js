import express from 'express';
import * as controller from '../controllers/PdfController.js';

const router = express.Router();

router.get('/todos', controller.imoveisTodos); 
router.get('/:id', controller.imovelPorId);

export default router;