import express from "express";
import produtorController from "../controllers/produtor";

const ProdutorRouter = express.Router();

ProdutorRouter.get("/", produtorController.getAll);
ProdutorRouter.get("/documento/:id", produtorController.getByDocumento);
ProdutorRouter.post("/", produtorController.add);
ProdutorRouter.put("/", produtorController.update);
ProdutorRouter.delete("/:id", produtorController.remove);

ProdutorRouter.get("/quantidade", produtorController.getAllQuantity);
ProdutorRouter.get("/area-total", produtorController.getAllTotalArea);

ProdutorRouter.get("/graph-by-estado", produtorController.getAllGraphByEstado);
ProdutorRouter.get(
  "/graph-by-uso-solo",
  produtorController.getAllGraphBySoloUsado
);
ProdutorRouter.get("/graph-cultura", produtorController.getAllGraphByCultura);

export default ProdutorRouter;
