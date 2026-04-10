import express from 'express';
import upload from '../utils/uploadConfig.js';
import * as controller from '../controllers/pdfController.js';

const router = express.Router();

/**
 * ROTA DE UPLOAD
 * O 'upload.single('foto')' extrai o arquivo enviado pelo Postman/Frontend
 * e o coloca dentro de 'req.file' para o controller usar.
 */
router.post('/:id/foto', upload.single('foto'), controller.uploadFoto);

/**
 * ROTA DE VISUALIZAÇÃO
 * Retorna o link ou os dados da foto do imóvel
 */
router.get('/:id/foto', controller.verFoto);

export default router;