import sq from "../config/db";

import { DataTypes } from "sequelize";

const ProdutorModel = sq.define("produtor", {
  documento: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },

  nome_produtor: {
    type: DataTypes.STRING,
  },

  cidade: {
    type: DataTypes.STRING,
  },

  estado: {
    type: DataTypes.STRING,
  },

  nome_fazenda: {
    type: DataTypes.STRING,
  },

  area_total_fazenda: {
    type: DataTypes.INTEGER,
  },

  area_agricultavel_fazenda: {
    type: DataTypes.INTEGER,
  },

  area_vegetacao_fazenda: {
    type: DataTypes.INTEGER,
  },
});

ProdutorModel.sync({ alter: true })
  .then(() => {
    console.log("Conectado com tabela de produtores");
  })
  .catch(() =>
    console.log("Ocorreu um erro para conectar com a tabela de produtores")
  );

export default ProdutorModel;
