import { NextFunction, Request, Response } from "express";
import {
  addProdutor,
  getAllProdutores,
  getAllProdutorsGraphByArea,
  getAllProdutorsGraphByField,
  getAllFazendasQuantity,
  getAllProdutorsTotalArea,
  removeProdutor,
  updateProdutor,
  getAllCulturas,
  getProdutorbyDocumento,
} from "../services/produtor";
import FazendaModel from "../models/fazenda";
import CulturaFazendaModel from "../models/cultura-fazenda";

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

const getAllQuantity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await getAllFazendasQuantity());
  } catch (err: any) {
    console.error(`Erro para remover o produtor`, err.message);
    res.status(400).send(err.message);
  }
};

const getAllTotalArea = async (
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

const getAllGraphByEstado = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(
      await getAllProdutorsGraphByField(FazendaModel, "estado", "documento")
    );
  } catch (err: any) {
    console.error(`Erro para remover o produtor`, err.message);
    res.status(400).send(err.message);
  }
};

const getAllGraphBySoloUsado = async (
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

const getAllGraphByCultura = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const culturas = await getAllCulturas();
    const culturasFazenda = await getAllProdutorsGraphByField(
      CulturaFazendaModel,
      "id_cultura",
      "id"
    );

    const response = culturasFazenda.map((cultFaz: any) => {
      return {
        ...cultFaz,
        nome_cultura: culturas
          .find((a) => a.toJSON().id === cultFaz.id_cultura)
          ?.toJSON().nome,
      };
    });

    res.json(response);
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
  getAllGraphByCultura,
  getByDocumento,
};
