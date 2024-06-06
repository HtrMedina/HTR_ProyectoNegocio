import { Router } from "express";
import { getRAccion, getRProduct, getRProducts } from "../controllers/registroProductos.controllers.js";

const router = Router()

// Rutas productos
router.get("/registroproductos", getRProducts);
router.post("/registroproductosaccion", getRAccion);
router.post("/registroproductosname", getRProduct);

export default router