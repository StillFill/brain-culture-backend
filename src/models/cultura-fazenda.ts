import sq from "../config/db";

import { DataTypes } from "sequelize";
import CulturaModel from "./cultura";

const CulturaFazendaModel = sq.define("culturafazendas", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },

  id_fazenda: {
    type: DataTypes.INTEGER,
    references: {
      model: "fazendas",
      key: "id",
    },
  },

  id_cultura: {
    type: DataTypes.INTEGER,
    references: {
      model: "culturas",
      key: "id",
    },
  },
});

CulturaFazendaModel.sync({ alter: true })
  .then(() => {
    console.log("Conectado com tabela de culturas da fazenda");
  })
  .catch((err: any) => {
    console.log(err.message);
    console.log(
      "Ocorreu um erro para conectar com a tabela de culturas da fazenda"
    );
  });

export default CulturaFazendaModel;
