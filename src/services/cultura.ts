import CulturaModel from "../models/cultura";

const culturasDefault = [
  {
    nome: "Soja",
  },
  {
    nome: "Milho",
  },
  {
    nome: "Algodão",
  },
  {
    nome: "Café",
  },
  {
    nome: "Cana de açucar",
  },
];

export const getAllCulturas = async () => {
  return await CulturaModel.findAll();
};

export const createInitialCulturas = async () => {
  const culturas = await getAllCulturas();
  if (culturas.length === 0) {
    CulturaModel.bulkCreate(culturasDefault);
  }
};
