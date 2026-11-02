import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses } from "./middleware/logResponses.js";
import { middlewareMetricsInc } from "./middleware/metricsInc.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);

app.use("/app", middlewareMetricsInc);
app.use("/app", express.static("./src/app"));

app.get("/healthz", handlerReadiness);
app.get("/metrics", handlerMetrics);
app.get("/reset", handlerReset);


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
