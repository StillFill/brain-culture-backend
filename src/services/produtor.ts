import sequelize from "../config/db";
import { IProdutor } from "../interfaces/produtor";
import { ProdutorSchema } from "../middlewares/validateProdutorSchema";
// import { ProdutorSchema } from "../middlewares/validateProdutorSchema";
import ProdutorModel from "../models/produtor";

export const getAllProdutores = async () => {
  return await ProdutorModel.findAll();
};

export const addProdutor = async (produtor: IProdutor) => {
  await ProdutorSchema.validateAsync(produtor);

  validateAreaTotal(produtor);

  return await ProdutorModel.create(buildToInsertOrUpdate(produtor));
};

export const updateProdutor = async (produtor: IProdutor) => {
  await ProdutorSchema.validateAsync(produtor);

  validateAreaTotal(produtor);

  return await ProdutorModel.update(buildToInsertOrUpdate(produtor), {
    where: {
      documento: produtor.documento,
    },
  });
};

export const removeProdutor = async (documento: string) => {
  return await ProdutorModel.destroy({
    where: {
      documento,
    },
  });
};

export const getAllProdutorsQuantity = async () => {
  return await ProdutorModel.count();
};

export const getAllProdutorsTotalArea = async () => {
  return await ProdutorModel.sum("area_total_fazenda");
};

export const getAllProdutorsGraphByField = async (field: string) => {
  const estadoGroup = (await ProdutorModel.findAll({
    attributes: [field, [sequelize.fn("COUNT", "documento"), "quantity"]],
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
      percentage: (a.quantity * 100) / totalCount,
    };
  });

  return groupWithPercentage;
};

export const getAllProdutorsGraphByArea = async () => {
  const areas = (
    await ProdutorModel.findOne({
      attributes: [
        [
          sequelize.fn("sum", sequelize.col("area_agricultavel_fazenda")),
          "area_agricultavel",
        ],
        [
          sequelize.fn("sum", sequelize.col("area_vegetacao_fazenda")),
          "area_vegetacao",
        ],
      ],
    })
  )?.toJSON();

  const areaAgricultavel = Number(areas.area_agricultavel);
  const areaVegetacao = Number(areas.area_vegetacao);

  const totalCount = areaAgricultavel + areaVegetacao;
  return [
    {
      area_agricultavel: areaAgricultavel,
      percentage:
        Math.round(((areaAgricultavel * 100) / totalCount) * 100) / 100,
    },
    {
      area_vegetacao: areaVegetacao,
      percentage: Math.round(((areaVegetacao * 100) / totalCount) * 100) / 100,
    },
  ];
};

const validateAreaTotal = (produtor: IProdutor) => {
  const isInvalid =
    produtor.area_total_fazenda <
    produtor.area_agricultavel_fazenda + produtor.area_vegetacao_fazenda;
  if (isInvalid)
    throw new Error(
      "Área total da fazenda menor que a soma das areas agricultaveis e de vegetação juntas"
    );
};

const buildToInsertOrUpdate = (produtor: IProdutor) => {
  return {
    ...produtor,
  };
};
