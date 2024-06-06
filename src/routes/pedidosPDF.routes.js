import { Router } from "express";
import { getPedidoFact, getPedidoPDF } from "../controllers/pedidos.controllers.js";


const router = Router();


//Obetener un elemento por ID
router.get("/pedido/:id", getPedidoPDF);

router.get("/pedidoDetalle/:id",getPedidoFact);
export default router;
