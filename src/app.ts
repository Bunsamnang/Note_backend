import express from "express";
import noteRoute from "./routes/noteRoute";
import createHttpError, { isHttpError } from "http-errors";
import { Request, Response, NextFunction } from "express";
const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/api/notes", noteRoute);

// when accessing an endpoint that does not exist
app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint Not Found"));
});
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error("Error encountered", err);
  let errorMsg = "An unknown error occurred";
  let statusCode = 500;

  if (isHttpError(err)) {
    errorMsg = err.message;
    statusCode = err.status;
  }

  res.status(statusCode).json({ message: errorMsg });
});

export default app;
