import express from 'express';
<<<<<<< HEAD
import * as controller from '../controllers/PdfController.js'; // Ajuste o nome do arquivo se necessário

const router = express.Router();

router.get('/pdf', controller.imoveisTodos);
router.get('/:id', controller.imovelPorId);
=======
import * as controller from '../controllers/pdfController.js';

const router = express.Router();

router.get('/pdf', controller.gerarPdfTodos);

router.get('/:id/pdf', controller.gerarPdfImovel);

export default router;

/* Arruma erros */ 
>>>>>>> 20acfbd029995db8e632dbe77e5c8ac2a8b611da

