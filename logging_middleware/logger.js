const axios = require("axios");

const LOG_API = "http://20.207.122.201/evaluation-service/logs";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJqYXlha3Jpc2huYV9ndWRlQHNybWFwLmVkdS5pbiIsImV4cCI6MTc3NzcwNzExNSwiaWF0IjoxNzc3NzA2MjE1LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiOGYxMzZhMTItZDYxNi00MjVjLThjNTUtNjc0OTMzNGJmNjBjIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiamF5YWtyaXNobmEiLCJzdWIiOiJmMTdiMWNiMC1lYmZmLTQ5NzMtODYyMy1lZThjZDFlZTIxZDkifSwiZW1haWwiOiJqYXlha3Jpc2huYV9ndWRlQHNybWFwLmVkdS5pbiIsIm5hbWUiOiJqYXlha3Jpc2huYSIsInJvbGxObyI6ImFwMjMxMTAwMTE2MzkiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiJmMTdiMWNiMC1lYmZmLTQ5NzMtODYyMy1lZThjZDFlZTIxZDkiLCJjbGllbnRTZWNyZXQiOiJBRGVIY2J1TlpudnlZUGdLIn0.pZ9AxuXGanQY-yFPEg5K-f9e1nvUiZjsW_N4qIn-N1U";

async function Log(stack, level, pkg, message) {
  try {
    await axios.post(
      LOG_API,
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );
  } catch (err) {
    console.log("Log failed:", err.message); // keep this
  }
}

module.exports = Log;