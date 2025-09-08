import express from "express";
import { create, findAll, findOne, update, delete as deleteSalon } from "../controllers/salon.controller.js";
const router = express.Router();

router.post("/", create);
router.get("/", findAll);
router.get("/:id", findOne);
router.put("/:id", update);
router.delete("/:id", deleteSalon);

export default router;