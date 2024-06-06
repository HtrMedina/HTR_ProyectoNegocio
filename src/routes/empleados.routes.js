import { Router } from "express";
import { createEmpleado, deleteEmpleado, getEmpleado, getEmpleadoname, getEmpleados, updateEmpleado } from "../controllers/empleados.controllers.js";

const router = Router()

// Rutas empleados
router.get("/empleados", getEmpleados);
router.get("/empleados/:id", getEmpleado);
router.post("/empleados", createEmpleado);
router.put("/empleados/:id", updateEmpleado);
router.delete("/empleados/:id", deleteEmpleado);

router.post("/empleadosname", getEmpleadoname);

export default router