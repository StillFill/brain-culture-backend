import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "brain_culture",
  "postgres",
  "braincultureadmin",
  {
    dialect: "postgres",
  }
);

export default sequelize;
