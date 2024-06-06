import { Router } from "express";
import { getRVenta, getRVentas } from "../controllers/registroVentas.controllers.js";

const router = Router()

// Rutas productos
router.get("/registroventas", getRVentas);
router.get("/registroventas/:id", getRVenta);



export default router