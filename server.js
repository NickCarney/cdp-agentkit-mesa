import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

app.use(cors());

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON from the webhook
app.use(bodyParser.json());

app.post("/trigger-script", async (req, res) => {
  console.log("Received Supabase Webhook:", req.body);

  try {
    // Trigger your TypeScript agent script here
    const { exec } = await import("child_process");
    exec("node chatbot.ts", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing script: ${error.message}`);
        return res.status(500).send("Error triggering script.");
      }
      console.log(`Script Output: ${stdout}`);
      res.status(200).send("Script triggered successfully!");
    });
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(500).send("Error processing webhook.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
