import express, { Request, Response, Application } from "express";
import ProdutorRouter from "./src/routes/produtor";
import bodyParser from "body-parser";
import { cpf, cnpj } from "cpf-cnpj-validator";

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (_: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server");
});

app.use("/produtores", ProdutorRouter);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
