import { Router } from "express";
import {
    createProduct,
    deleteProduct,
    getNombresCategorias,
    getNombresProveedores,
    getProduct,
    getProductoname,
    getProducts,
    updateProduct
}from '../controllers/productos.controllers.js'

const router = Router()

// Rutas productos
router.get("/productos", getProducts);
router.get("/productos/:id", getProduct);
router.post("/productos", createProduct);
router.put("/productos/:id", updateProduct);
router.delete("/productos/:id", deleteProduct);

router.post("/productosname", getProductoname);
router.get("/nombresProveedores",getNombresProveedores);
router.get("/nombresCategorias",getNombresCategorias);

export default router