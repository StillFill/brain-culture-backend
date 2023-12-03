import { Model, ModelCtor } from "sequelize";
import FazendaModel from "../models/fazenda";
import sequelize from "../config/db";

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
