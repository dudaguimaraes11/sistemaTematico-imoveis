import express from "express";
const router = express.Router();

import * as controller from "../controllers/pdfController.js";

router.get("/pdf/imoveis/:id", controller.imovelPorId);
router.get("/pdf/imoveis", controller.imoveisTodos);

export default router;