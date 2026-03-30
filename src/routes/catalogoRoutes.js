const express = require('express');
const router = express.Router();
const upload = require('../utils/uploadConfig');
const FotoController = require('../controllers/FotoController');

//Post
router.post('/:id/foto', upload.single('foto'), FotoController.uploadFoto);

//GET
router.get('/:id/foto', FotoController.getFoto);

module.exports = router;
