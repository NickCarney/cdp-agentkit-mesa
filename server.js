import express from "express";
import { spawn } from "child_process";

const app = express();
app.use(express.json()); // To parse incoming JSON requests

// POST endpoint for Supabase webhook
app.post("/trigger-script", async (req, res) => {
  console.log("Received Supabase Webhook:", req.body);

  // Run the Node.js script
  const process = spawn("node", ["path/to/your-script.ts"]);

  process.stdout.on("data", (data) => {
    console.log(`Output: ${data}`);
  });

  process.stderr.on("data", (data) => {
    console.error(`Error: ${data}`);
  });

  process.on("close", (code) => {
    console.log(`Script exited with code ${code}`);
  });

  res.status(200).send("Node.js script triggered successfully.");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
