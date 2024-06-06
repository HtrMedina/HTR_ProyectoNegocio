import { Router } from "express";
import { createCategoria, deleteCategoria, getCategoria, getCategorianame, getCategorias, updateCategoria } from "../controllers/categorias.controllers.js";

const router = Router()

// Rutas Categorias
router.get("/categorias", getCategorias);
router.get("/categorias/:id", getCategoria);
router.post("/categorias", createCategoria);
router.put("/categorias/:id", updateCategoria);
router.delete("/categorias/:id", deleteCategoria);

router.post("/categoriasname", getCategorianame);

export default router