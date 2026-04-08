import express from 'express';
import * as controller from '../controllers/imoveisController.js';
import upload from '../utils/uploadConfig.js';
import * as FotoController from '../controllers/FotoController.js';
import autenticarApiKey from '../utils/apiKey.js';

const router = express.Router();

router.post('/imoveis', autenticarApiKey, controller.criar);
router.get('/imoveis', autenticarApiKey, controller.buscarTodos);
router.get('/imoveis/:id', autenticarApiKey, controller.buscarPorId);
router.put('/imoveis/:id', autenticarApiKey, controller.atualizar);
router.delete('/imoveis/:id', autenticarApiKey, controller.excluir);

router.post('/catalogo/:id/foto', autenticarApiKey, upload.single('foto'), FotoController.uploadFoto);
router.get('/catalogo/:id/foto', autenticarApiKey, FotoController.getFoto);

export default router;