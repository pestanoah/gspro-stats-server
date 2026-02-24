import express from "express";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware";
import { dao } from "./dao/dao";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);
app.use(express.json());

// ping endopoint
app.get("/api/ping", (_, res) => {
  res.json({ message: "pong" });
});

app.get("/api/rounds/:date", async (req, res) => {
  const roundDate = req.params.date;

  await dao.GetShotsByDay(new Date(roundDate)).then((shots) => {
    res.json({ shots });
  });
});

app.get("/api/rounds/:startDate/:endDate", async (req, res) => {
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;

  await dao
    .GetShotsByDateRange(
      new Date(startDate),
      new Date(endDate),
      req.query.clubName as string,
    )
    .then((shots) => {
      res.json({ shots });
    });
});

app.get("/api/shots/latest", async (req, res) => {
  await dao.GetLatestShots(Number(req.query.limit) || 100).then((shots) => {
    res.json({ shots });
  });
});

app.use(errorMiddleware);
export { app };
