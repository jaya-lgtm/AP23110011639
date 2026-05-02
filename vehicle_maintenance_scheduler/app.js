const axios = require("axios");
const Log = require("../logging_middleware/logger");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJqYXlha3Jpc2huYV9ndWRlQHNybWFwLmVkdS5pbiIsImV4cCI6MTc3NzcwNzExNSwiaWF0IjoxNzc3NzA2MjE1LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiOGYxMzZhMTItZDYxNi00MjVjLThjNTUtNjc0OTMzNGJmNjBjIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiamF5YWtyaXNobmEiLCJzdWIiOiJmMTdiMWNiMC1lYmZmLTQ5NzMtODYyMy1lZThjZDFlZTIxZDkifSwiZW1haWwiOiJqYXlha3Jpc2huYV9ndWRlQHNybWFwLmVkdS5pbiIsIm5hbWUiOiJqYXlha3Jpc2huYSIsInJvbGxObyI6ImFwMjMxMTAwMTE2MzkiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiJmMTdiMWNiMC1lYmZmLTQ5NzMtODYyMy1lZThjZDFlZTIxZDkiLCJjbGllbnRTZWNyZXQiOiJBRGVIY2J1TlpudnlZUGdLIn0.pZ9AxuXGanQY-yFPEg5K-f9e1nvUiZjsW_N4qIn-N1U";

async function fetchDepots() {
  try {
    await Log("backend", "info", "service", "Fetching depots");

    const res = await axios.get(
      "http://20.207.122.201/evaluation-service/depots",
      {
        headers: { Authorization: `Bearer ${TOKEN}` },
      }
    );

    await Log("backend", "info", "service", "Depots fetched successfully");

    return res.data.depots;
  } catch (err) {
    await Log("backend", "error", "service", err.message);
    throw err;
  }
}

async function fetchVehicles() {
  try {
    await Log("backend", "info", "service", "Fetching vehicles");

    const res = await axios.get(
      "http://20.207.122.201/evaluation-service/vehicles",
      {
        headers: { Authorization: `Bearer ${TOKEN}` },
      }
    );

    await Log("backend", "info", "service", "Vehicles fetched successfully");

    return res.data.vehicles;
  } catch (err) {
    await Log("backend", "error", "service", err.message);
    throw err;
  }
}

function knapsack(tasks, maxHours) {
  const n = tasks.length;

  const dp = Array(n + 1)
    .fill()
    .map(() => Array(maxHours + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const { Duration, Impact } = tasks[i - 1];

    for (let w = 0; w <= maxHours; w++) {
      if (Duration <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          Impact + dp[i - 1][w - Duration]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  return dp[n][maxHours];
}

async function runScheduler() {
  try {
    await Log("backend", "info", "service", "Scheduler started");

    const depots = await fetchDepots();
    const vehicles = await fetchVehicles();

    for (let depot of depots) {
      await Log(
        "backend",
        "info",
        "service",
        `Running scheduler for depot ${depot.ID}`
      );

      const result = knapsack(vehicles, depot.MechanicHours);

      console.log(`Depot ${depot.ID}: Max Impact = ${result}`);

      await Log(
        "backend",
        "info",
        "service",
        `Depot ${depot.ID} result = ${result}`
      );
    }
  } catch (err) {
    await Log("backend", "error", "handler", err.message);
    console.log(err.message);
  }
}

runScheduler();