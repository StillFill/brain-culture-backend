import CulturaModel from "../models/cultura";

export const getAllCulturas = async () => {
  return await CulturaModel.findAll();
};
