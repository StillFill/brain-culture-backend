import { NextFunction, Request, Response } from "express";
import {
  addProdutor,
  getAllProdutores,
  getAllProdutorsGraphByArea,
  getAllProdutorsGraphByField,
  getAllProdutorsQuantity,
  getAllProdutorsTotalArea,
  removeProdutor,
  updateProdutor,
} from "../services/produtor";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await getAllProdutores());
  } catch (err: any) {
    console.error(`Erro para buscar todos os produtores`, err.message);
    res.status(400).send(err.message);
  }
};

export const add = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await addProdutor(req.body));
  } catch (err: any) {
    console.error(`Erro para adicionar o produtor`, err.message);
    res.status(400).send(err.message);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await updateProdutor(req.body));
  } catch (err: any) {
    console.error(`Erro para atualizar o produtor`, err.message);
    res.status(400).send(err.message);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await removeProdutor(req.params.id));
  } catch (err: any) {
    console.error(`Erro para remover o produtor`, err.message);
    res.status(400).send(err.message);
  }
};

export const getAllQuantity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await getAllProdutorsQuantity());
  } catch (err: any) {
    console.error(`Erro para remover o produtor`, err.message);
    res.status(400).send(err.message);
  }
};

export const getAllTotalArea = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await getAllProdutorsTotalArea());
  } catch (err: any) {
    console.error(`Erro para remover o produtor`, err.message);
    res.status(400).send(err.message);
  }
};

export const getAllGraphByEstado = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await getAllProdutorsGraphByField("estado"));
  } catch (err: any) {
    console.error(`Erro para remover o produtor`, err.message);
    res.status(400).send(err.message);
  }
};

export const getAllGraphBySoloUsado = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await getAllProdutorsGraphByArea());
  } catch (err: any) {
    console.error(`Erro para remover o produtor`, err.message);
    res.status(400).send(err.message);
  }
};

export default {
  getAll,
  add,
  update,
  remove,
  getAllQuantity,
  getAllTotalArea,
  getAllGraphByEstado,
  getAllGraphBySoloUsado,
};
