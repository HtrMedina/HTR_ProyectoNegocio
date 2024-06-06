import { Router } from "express";
import { getProductosTicket } from "../controllers/facturas.controllers.js";

const router = Router()

// Rutas facturas
router.get("/registrofacturas/:id", getProductosTicket);

export default router