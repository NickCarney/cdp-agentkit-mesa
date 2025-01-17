const { createClient } = require("@supabase/supabase-js");
// const { initializeAgent, runAutonomousMode } = require("./chatbot.ts");

console.log("Initializing Supabase client...");

// Replace with your actual Supabase URL and API key
const supabase = createClient(
  process.env.SUPABASE_URL, // Supabase URL
  process.env.SUPABASE_KEY // Supabase anon Key
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
    (payload) => {
      console.log("New row added:", payload); // Log the payload
      // Call chatbot logic or other functions here
      // initializeAgent();
    }
  )
  .subscribe((status) => {
    console.log("Subscription status:", status); // Log subscription status
  });

// Optional: Handle disconnections and errors
channel.on("error", (error) => {
  console.error("Error in channel subscription:", error);
});
