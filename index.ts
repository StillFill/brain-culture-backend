import express, { Request, Response, Application } from "express";
import ProdutorRouter from "./src/routes/produtor";
import bodyParser from "body-parser";
import cors from "cors";

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.get("/", (_: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server");
});

app.use("/produtores", ProdutorRouter);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
