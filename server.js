const { createClient } = require("@supabase/supabase-js");
const { initializeAgent, runAutonomousMode } = require("./chatbot.js");

console.log("Initializing Supabase client...");

// Replace with your actual Supabase URL and API key
const supabase = createClient(
  "https://ewvzsofyvxcctuxxqibo.supabase.co", // Supabase URL
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3dnpzb2Z5dnhjY3R1eHhxaWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY5NDUzMTMsImV4cCI6MjAxMjUyMTMxM30.VNQlQGxPThyLg4Ge2kD_n_VmF5FNLC13jVJOrT1PktY" // Supabase anon Key
);

// Subscribe to changes in the 'contracts' table
const channel = supabase
  .channel("schema-db-changes")
  .on(
    "postgres_changes",
    {
      event: "INSERT", // Listen for insert events
      schema: "public", // Database schema (usually public)
      table: "contracts", // Specify the 'contracts' table here
    },
    async (payload) => {
      console.log("New row added:", payload);
      const ipfs_url =
        "https://mesa.mypinata.cloud/ipfs/" + payload.new.ipfs_cid;
      const { agent, config } = await initializeAgent();
      await runAutonomousMode(agent, config, ipfs_url);
    }
  )
  .subscribe((status) => {
    console.log("Subscription status:", status); // Log subscription status
  });

// Optional: Handle disconnections and errors
channel.on("error", (error) => {
  console.error("Error in channel subscription:", error);
});
