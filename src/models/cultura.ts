import sq from "../config/db";

import { DataTypes } from "sequelize";
import CulturaFazendaModel from "./cultura-fazenda";

const CulturaModel = sq.define("culturas", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },

  nome: {
    type: DataTypes.STRING,
  },
});

CulturaModel.sync({ alter: true })
  .then(() => {
    console.log("Conectado com tabela de culturas");
  })
  .catch(() =>
    console.log("Ocorreu um erro para conectar com a tabela de culturas")
  );

export default CulturaModel;
