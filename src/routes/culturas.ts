import express from "express";
import culturaController from "../controllers/culturas";

const CulturaRouter = express.Router();

CulturaRouter.get("/", culturaController.getAll);

export default CulturaRouter;
