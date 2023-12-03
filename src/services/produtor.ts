import sequelize from "../config/db";
import { IProdutorFazendaRequest } from "../interfaces/requests/IProdutorFazendaRequest";
import { ICulturaFazenda } from "../interfaces/culturaFazenda";
import { IFazenda } from "../interfaces/fazenda";
import { IProdutor } from "../interfaces/produtor";
import { ProdutorSchema } from "../middlewares/validateProdutorSchema";
import CulturaFazendaModel from "../models/cultura-fazenda";
import FazendaModel from "../models/fazenda";
import ProdutorModel from "../models/produtor";
import { getAllCulturas } from "./cultura";

const deParaFazenda: any = [
  ["area_agricultavel", "area_agricultavel_fazenda"],
  ["area_vegetacao", "area_vegetacao_fazenda"],
  ["area_total", "area_total_fazenda"],
  "cidade",
  "estado",
  "nome",
];

export const getAllProdutores = async () => {
  const res = await ProdutorModel.findAll({
    include: [
      {
        model: FazendaModel,
        required: true,
        attributes: [...deParaFazenda],
        include: [
          {
            model: CulturaFazendaModel,
            required: false,
          },
        ],
      },
    ],
  });

  const culturas = await getAllCulturas();

  return res.map((r) => {
    const { fazendas, ..._r } = r.toJSON();
    const [{ culturafazendas, ...fazenda }] = fazendas;

    return {
      ...fazenda,
      ..._r,
      nome_fazenda: fazendas[0].nome,
      culturas: culturafazendas.map((f: any) => {
        const cultura = culturas
          .find((a) => a.toJSON().id === f.id_cultura)
          ?.toJSON();

        return {
          id: f.id_cultura,
          nome: cultura ? cultura.nome : "",
        };
      }),
    };
  });
};

export const getProdutorbyDocumento = async (documento: string) => {
  const res = await ProdutorModel.findOne({
    where: {
      documento,
    },
    include: [
      {
        model: FazendaModel,
        required: true,
      },
    ],
  });

  if (!res) return null;

  const { fazendas, ..._r } = res?.toJSON();

  return {
    ...fazendas[0],
    ..._r,
    nome_fazenda: fazendas[0].nome_fazenda,
  };
};

export const addProdutor = async (produtorReq: IProdutorFazendaRequest) => {
  await ProdutorSchema.validateAsync(produtorReq);

  validateAreaTotal(produtorReq);

  const produtor = buildProdutorToInsertOrUpdate(produtorReq);
  const fazenda = buildFazendaToInsertOrUpdate(produtorReq);

  const transaction = await sequelize.transaction();

  try {
    await ProdutorModel.create({ ...produtor }, { transaction });

    const idFazenda = (
      await FazendaModel.create(
        {
          ...fazenda,
          documento_produtor: produtor.documento,
        },
        { transaction }
      )
    ).toJSON().id;

    const culturasToInsert: any = produtorReq.culturas?.map((id_cultura) =>
      buildCulturasFazendaToInsertOrUpdate(idFazenda, id_cultura)
    );

    await CulturaFazendaModel.bulkCreate(culturasToInsert, { transaction });

    await transaction.commit();
  } catch (err: any) {
    console.error("ERRO CADASTRAR PRODUTOR: ", err.message);
    await transaction.rollback();
    throw new Error(err.message);
  }
};

export const updateProdutor = async (produtorReq: IProdutorFazendaRequest) => {
  await ProdutorSchema.validateAsync(produtorReq);

  validateAreaTotal(produtorReq);

  const produtor = buildProdutorToInsertOrUpdate(produtorReq);
  const fazenda = buildFazendaToInsertOrUpdate(produtorReq);

  const transaction = await sequelize.transaction();

  try {
    const { documento, ...prodt } = produtor;

    await ProdutorModel.update(
      {
        ...prodt,
      },
      { where: { documento: produtor.documento }, transaction }
    );

    await FazendaModel.update(
      {
        ...fazenda,
      },
      { where: { documento_produtor: produtor.documento }, transaction }
    );

    const fzd = (
      await FazendaModel.findOne({
        where: { documento_produtor: produtor.documento },
        transaction,
      })
    )?.toJSON();

    const culturasFromFazenda = await CulturaFazendaModel.findAll({
      where: { id_fazenda: fzd.id },
    });

    const culturasToAdd = produtorReq.culturas
      .filter(
        (a) => !culturasFromFazenda.find((b) => b.toJSON().id_cultura === a)
      )
      .map((a) => ({
        id_fazenda: fzd.id,
        id_cultura: a,
      }));

    const culturasToRemove = culturasFromFazenda
      .filter(
        (a) => !produtorReq.culturas.find((b) => a.toJSON().id_cultura === b)
      )
      .map((a) => a.toJSON().id_cultura);

    await CulturaFazendaModel.bulkCreate(culturasToAdd, { transaction });
    await CulturaFazendaModel.destroy({
      where: { id_cultura: culturasToRemove },
      transaction,
    });

    await transaction.commit();
  } catch (err: any) {
    console.error("ERRO ATUALIZAR PRODUTOR: ", err.message);
    await transaction.rollback();
    throw new Error(err.message);
    // adicionar transaction abort (se der tempo)
  }
};

export const removeProdutor = async (documento: string) => {
  return await ProdutorModel.destroy({
    where: {
      documento,
    },
  });
};

const validateAreaTotal = (produtor: IProdutorFazendaRequest) => {
  const isInvalid =
    produtor.area_total_fazenda <
    produtor.area_agricultavel_fazenda + produtor.area_vegetacao_fazenda;
  if (isInvalid)
    throw new Error(
      "Área total da fazenda menor que a soma das areas agricultaveis e de vegetação juntas"
    );
};

const buildProdutorToInsertOrUpdate = (
  req: IProdutorFazendaRequest
): IProdutor => {
  return {
    documento: req.documento_produtor,
    nome: req.nome,
  };
};

const buildFazendaToInsertOrUpdate = (
  req: IProdutorFazendaRequest
): IFazenda => {
  return {
    nome: req.nome_fazenda,
    area_agricultavel: req.area_agricultavel_fazenda,
    area_total: req.area_total_fazenda,
    area_vegetacao: req.area_vegetacao_fazenda,
    cidade: req.cidade,
    estado: req.estado,
  };
};

const buildCulturasFazendaToInsertOrUpdate = (
  idFazenda: number,
  idCultura: number
): ICulturaFazenda => {
  return {
    id_cultura: idCultura,
    id_fazenda: idFazenda,
  };
};
