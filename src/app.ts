import cors from "cors";
import "dotenv/config";
import "express-async-errors";
import express, { json } from "express";
import AppRouter from "./routers/index";
import { errorHandler, errorLogger } from "./middleware/error";

const app = express();

app.use(json());
app.use(cors());

app.use(AppRouter);

app.use(errorLogger);
app.use(errorHandler);

export default app;
