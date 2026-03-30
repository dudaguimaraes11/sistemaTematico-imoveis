import { upload } from '../utils/uploadConfig.js';
import * as FotoController from '../controllers/FotoController.js';

//POST
router.post('/catalogo/:id/foto', upload.single('foto'), FotoController.uploadFoto);

// GET
router.get('/catalogo/:id/foto', FotoController.getFoto);
