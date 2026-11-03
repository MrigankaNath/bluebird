import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses } from "./middleware/logResponses.js";
import { middlewareMetricsInc } from "./middleware/metricsInc.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { handlerValidateChirp } from "./api/validateChirp.js";
import { middlewareErrorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = 8080;

app.use(express.json());

app.use(middlewareLogResponses);

app.use("/app", middlewareMetricsInc);
app.use("/app", express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.post("/api/validate_chirp", handlerValidateChirp);

app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerReset);

app.use(middlewareErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
