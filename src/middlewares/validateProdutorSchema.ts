import Joi from "joi";
import { cpf, cnpj } from "cpf-cnpj-validator";

export const ProdutorSchema = Joi.object({
  documento: Joi.string().custom((value, helpers) => {
    if (!cpf.isValid(value) && !cnpj.isValid(value)) {
      return helpers.error("any.invalid");
    }
  }),
  nome_produtor: Joi.string(),
  cidade: Joi.string(),
  estado: Joi.string(),
  nome_fazenda: Joi.string(),
  area_total_fazenda: Joi.number(),
  area_agricultavel_fazenda: Joi.number(),
  area_vegetacao_fazenda: Joi.number(),
});
