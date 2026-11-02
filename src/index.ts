import express from "express";
import { handlerReadiness } from "./api/readiness.js";

const app = express();
const PORT = 8080;

app.get("/healthz", handlerReadiness);

app.use("/app", express.static("./src/app"));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
