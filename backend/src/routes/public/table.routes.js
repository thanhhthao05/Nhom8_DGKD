import express from "express";
import { tablePublicController } from "../../controllers/public/table.public.controller.js";

const router = express.Router();

// GET /api/public/tables/scan/:token - Khách scan QR bàn (không cần auth)
router.get("/scan/:token", tablePublicController.scanTable);

// GET /api/public/tables/token/:token (alias cho Postman kiểm thử)
router.get("/token/:token", tablePublicController.scanTable);

export default router;
