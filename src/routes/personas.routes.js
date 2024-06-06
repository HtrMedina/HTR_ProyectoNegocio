import { Router } from "express";
import { createPersona, deletePersona, getPersona, getPersonaname, getPersonas, updatePersona } from "../controllers/personas.controllers.js";

const router = Router()

// Rutas personas
router.get("/personas", getPersonas);
router.get("/personas/:id", getPersona);
router.post("/personas", createPersona);
router.put("/personas/:id", updatePersona);
router.delete("/personas/:id", deletePersona);

router.post("/personasname", getPersonaname);

export default router