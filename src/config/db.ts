import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "brain_culture",
  "postgres",
  "braincultureadmin",
  {
    dialect: "postgres",
    logging: false,
  }
);

export default sequelize;
