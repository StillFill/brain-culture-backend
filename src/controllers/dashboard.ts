import { NextFunction, Request, Response } from "express";
import {
  getAllProdutorsGraphByArea,
  getAllProdutorsGraphByField,
  getAllFazendasQuantity,
  getAllProdutorsTotalArea,
} from "../services/fazenda";
import FazendaModel from "../models/fazenda";
import CulturaFazendaModel from "../models/cultura-fazenda";
import { getAllCulturas } from "../services/cultura";

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
  getAllQuantity,
  getAllTotalArea,
  getAllGraphByEstado,
  getAllGraphBySoloUsado,
  getAllGraphByCultura,
};
