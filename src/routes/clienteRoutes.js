import express from 'express';
import * as controller from '../controllers/pdfController.js';
import autenticarApiKey from '../utils/apiKey.js'

const router = express.Router();

router.post('/cliente', autenticarApiKey, controller.criar);
router.get('/cliente', autenticarApiKey, controller.buscarTodos);
router.get('/cliente/:id', autenticarApiKey, controller.buscarPorId);
router.put('/cliente/:id', autenticarApiKey, controller.atualizar);
router.delete('/cliente/:id', autenticarApiKey, controller.deletar);

export default router;
