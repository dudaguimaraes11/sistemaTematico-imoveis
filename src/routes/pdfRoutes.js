import express from 'express';
import * as controller from '../controllers/PdfController.js'; // Ajuste o nome do arquivo se necessário

const router = express.Router();

router.get('/pdf', controller.imoveisTodos);
router.get('/:id', controller.imovelPorId);

export default router;