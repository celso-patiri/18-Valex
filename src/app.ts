import cors from "cors";
import "dotenv/config";
import "express-async-errors";
import express, { json } from "express";
import AppRouter from "./routers/index";
import ErrorHandler from "./middleware/error/errorHandler";
import ErrorLogger from "./middleware/error/errorLogger";

const app = express();

app.use(json());
app.use(cors());

app.use(AppRouter);

app.use(ErrorLogger);
app.use(ErrorHandler);

export default app;
