import express from 'express';
import upload from '../utils/uploadConfig.js';
import * as controller from '../controllers/pdfController.js';

const router = express.Router();

router.get('/pdf', controller.gerarPdfTodos);

router.get('/:id/pdf', controller.gerarPdfImovel);

export default router;