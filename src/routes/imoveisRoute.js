import express from 'express';
import * as controller from '../controllers/imoveisController.js';
import { upload } from '../utils/uploadConfig.js';
import * as FotoController from '../controllers/FotoController.js';

const router = express.Router();

router.post('/imoveis', controller.criar);
router.get('/imoveis', controller.buscarTodos);
router.get('/imoveis/:id', controller.buscarPorId);
router.put('/imoveis/:id', controller.atualizar);
router.delete('/imoveis/:id', controller.excluir);

export default router;

//POST
router.post('/catalogo/:id/foto', upload.single('foto'), FotoController.uploadFoto);

// GET
router.get('/catalogo/:id/foto', FotoController.getFoto);
