import { Router } from "express";
import { getFacturaPDF, getTicketFact } from "../controllers/descargarPDF.controllers.js";


const router = Router();


//Obetener un elemento por ID
router.get("/factura/:id", getFacturaPDF);

router.get("/facturaDetalle/:id",getTicketFact)
export default router;
