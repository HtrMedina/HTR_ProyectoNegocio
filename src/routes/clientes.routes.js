import { Router } from "express";
import { createCliente, deleteCliente, getCliente, getClientename, getClientes, updateCliente } from "../controllers/clientes.controllers.js";

const router = Router()

// Rutas clientes
router.get("/clientes", getClientes);
router.get("/clientes/:id", getCliente);
router.post("/clientes", createCliente);
router.put("/clientes/:id", updateCliente);
router.delete("/clientes/:id", deleteCliente);

router.post("/clientesname", getClientename);

export default router