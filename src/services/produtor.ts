import sequelize from "../config/db";
import { IProdutorFazendaRequest } from "../interfaces/requests/IProdutorFazendaRequest";
import { ICulturaFazenda } from "../interfaces/culturaFazenda";
import { IFazenda } from "../interfaces/fazenda";
import { IProdutor } from "../interfaces/produtor";
import { ProdutorSchema } from "../middlewares/validateProdutorSchema";
import CulturaFazendaModel from "../models/cultura-fazenda";
import FazendaModel from "../models/fazenda";
// import { ProdutorSchema } from "../middlewares/validateProdutorSchema";
import ProdutorModel from "../models/produtor";
import { Model, ModelCtor } from "sequelize";
import CulturaModel from "../models/cultura";

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
      },
    ],
  });

  return res.map((r) => {
    const { fazendas, ..._r } = r.toJSON();
    return {
      ...fazendas[0],
      ..._r,
      nome_fazenda: fazendas[0].nome,
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

export const getAllCulturas = async () => {
  return await CulturaModel.findAll();
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
    // adicionar transaction abort (se der tempo)
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

    // TODO: adicionar regra de adicionar ou remover cultura
    // const culturasToInsert: any = produtorReq.culturas?.map((id_cultura) =>
    //   buildCulturasFazendaToInsertOrUpdate(idFazenda, id_cultura)
    // );

    // await CulturaFazendaModel.bulkCreate(culturasToInsert, { transaction });

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

export const getAllFazendasQuantity = async () => {
  return await FazendaModel.count();
};

export const getAllProdutorsTotalArea = async () => {
  return await FazendaModel.sum("area_total");
};

export const getAllProdutorsGraphByField = async (
  model: ModelCtor<Model<any, any>>,
  field: string,
  id_field: string
) => {
  const estadoGroup = (await model.findAll({
    attributes: [field, [sequelize.fn("COUNT", id_field), "quantity"]],
    group: [field],
    raw: true,
  })) as any;

  const totalCount = estadoGroup.reduce(
    (a: number, b: { quantity: number }) => a + Number(b.quantity),
    0
  );

  const groupWithPercentage = estadoGroup.map((a: any) => {
    return {
      ...a,
      quantity: Number(a.quantity),
      percentage: Math.round(((a.quantity * 100) / totalCount) * 100) / 100,
    };
  });

  return groupWithPercentage;
};

export const getAllProdutorsGraphByArea = async () => {
  const areas = (
    await FazendaModel.findOne({
      attributes: [
        [
          sequelize.fn("sum", sequelize.col("area_agricultavel")),
          "area_agricultavel_qtd",
        ],
        [
          sequelize.fn("sum", sequelize.col("area_vegetacao")),
          "area_vegetacao_qtd",
        ],
      ],
    })
  )?.toJSON();

  const areaAgricultavel = Number(areas.area_agricultavel_qtd);
  const areaVegetacao = Number(areas.area_vegetacao_qtd);

  const totalCount = areaAgricultavel + areaVegetacao;
  return [
    {
      area: "Agricultável",
      quantity: areaAgricultavel,
      percentage:
        Math.round(((areaAgricultavel * 100) / totalCount) * 100) / 100,
    },
    {
      area: "Vegatação",
      quantity: areaVegetacao,
      percentage: Math.round(((areaVegetacao * 100) / totalCount) * 100) / 100,
    },
  ];
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
  idFazenda: string,
  idCultura: string
): ICulturaFazenda => {
  return {
    id_cultura: idCultura,
    id_fazenda: idFazenda,
  };
};
