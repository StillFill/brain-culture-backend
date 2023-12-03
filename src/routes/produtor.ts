import express from "express";
import produtorController from "../controllers/produtor";

const ProdutorRouter = express.Router();

ProdutorRouter.get("/", produtorController.getAll);
ProdutorRouter.get("/documento/:id", produtorController.getByDocumento);
ProdutorRouter.post("/", produtorController.add);
ProdutorRouter.put("/", produtorController.update);
ProdutorRouter.delete("/:id", produtorController.remove);

export default ProdutorRouter;
