import sq from "../config/db";

import { DataTypes } from "sequelize";
import FazendaModel from "./fazenda";

const ProdutorModel = sq.define("produtores", {
  documento: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },

  nome: {
    type: DataTypes.STRING,
  },
});

ProdutorModel.hasMany(FazendaModel, {
  foreignKey: "documento_produtor",
});

ProdutorModel.sync({ alter: true })
  .then(() => {
    console.log("Conectado com tabela de produtores");
  })
  .catch(() =>
    console.log("Ocorreu um erro para conectar com a tabela de produtores")
  );

export default ProdutorModel;
