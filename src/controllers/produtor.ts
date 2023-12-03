import { NextFunction, Request, Response } from "express";
import {
  addProdutor,
  getAllProdutores,
  removeProdutor,
  updateProdutor,
  getProdutorbyDocumento,
} from "../services/produtor";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getAllProdutores());
  } catch (err: any) {
    console.error(`Erro para buscar todos os produtores`, err.message);
    res.status(400).send(err.message);
  }
};

const getByDocumento = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const produtor = await getProdutorbyDocumento(req.params.id);
    if (!produtor) return res.status(404).send("Produtor não localizado");
    return res.json(produtor);
  } catch (err: any) {
    console.error(`Erro para buscar todos os produtores`, err.message);
    res.status(400).send(err.message);
  }
};

const add = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await addProdutor(req.body));
  } catch (err: any) {
    console.error(`Erro para adicionar o produtor`, err.message);
    res.status(400).send(err.message);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await updateProdutor(req.body));
  } catch (err: any) {
    console.error(`Erro para atualizar o produtor`, err.message);
    res.status(400).send(err.message);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await removeProdutor(req.params.id));
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
  getByDocumento,
};
