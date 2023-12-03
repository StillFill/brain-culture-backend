import { NextFunction, Request, Response } from "express";
import { getAllCulturas } from "../services/cultura";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getAllCulturas());
  } catch (err: any) {
    console.error(`Erro para buscar todos os produtores`, err.message);
    res.status(400).send(err.message);
  }
};

export default {
  getAll,
};
