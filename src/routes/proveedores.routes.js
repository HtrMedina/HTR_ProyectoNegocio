import { Router } from "express";
import { createProveedor, deleteProveedor, getProveedor, getProveedores, getProveedorname, updateProveedor } from "../controllers/proveedores.controllers.js";

const router = Router()

// Rutas proveedores
router.get("/proveedores", getProveedores);
router.get("/proveedores/:id", getProveedor);
router.post("/proveedores", createProveedor);
router.put("/proveedores/:id", updateProveedor);
router.delete("/proveedores/:id", deleteProveedor);

router.post("/proveedoresname", getProveedorname);

export default router