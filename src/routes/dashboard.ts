import express from "express";
import dashboardController from "../controllers/dashboard";

const DashboardRouter = express.Router();

DashboardRouter.get("/quantidade", dashboardController.getAllQuantity);
DashboardRouter.get("/area-total", dashboardController.getAllTotalArea);

DashboardRouter.get(
  "/graph-by-estado",
  dashboardController.getAllGraphByEstado
);
DashboardRouter.get(
  "/graph-by-uso-solo",
  dashboardController.getAllGraphBySoloUsado
);
DashboardRouter.get("/graph-cultura", dashboardController.getAllGraphByCultura);

export default DashboardRouter;
