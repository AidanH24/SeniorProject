// src/server.ts
import express from "express";
import submitRoute from "./routes/submitRoute";
import cors from "cors";
// src/server.ts (add near the top, after express app is created)
import path from "path";

// Serve the frontend from src/CustomerSide during development


const app = express();
app.use(cors());
app.use(express.json());
// Serve the frontend from src/CustomerSide during development
app.use(
    express.static(path.join(__dirname, "..", "src", "CustomerSide"))
  );
  

app.use("/api/submit", submitRoute);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
