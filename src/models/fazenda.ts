import sq from "../config/db";

import { DataTypes } from "sequelize";
import ProdutorModel from "./produtor";

const FazendaModel = sq.define("fazendas", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },

  documento_produtor: {
    type: DataTypes.STRING,
    references: {
      model: "produtores",
      key: "documento",
    },
  },

  nome: {
    type: DataTypes.STRING,
  },

  cidade: {
    type: DataTypes.STRING,
  },

  estado: {
    type: DataTypes.STRING,
  },

  area_total: {
    type: DataTypes.INTEGER,
  },

  area_agricultavel: {
    type: DataTypes.INTEGER,
  },

  area_vegetacao: {
    type: DataTypes.INTEGER,
  },
});

FazendaModel.sync({ alter: true })
  .then(() => {
    console.log("Conectado com tabela de fazendas");
  })
  .catch(() =>
    console.log("Ocorreu um erro para conectar com a tabela de fazendas")
  );

// FazendaModel.belongsTo(ProdutorModel);

export default FazendaModel;
