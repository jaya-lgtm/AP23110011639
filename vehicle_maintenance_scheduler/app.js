const axios = require("axios");
const Log = require("../logging_middleware/logger");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJqYXlha3Jpc2huYV9ndWRlQHNybWFwLmVkdS5pbiIsImV4cCI6MTc3NzcwMDk0NCwiaWF0IjoxNzc3NzAwMDQ0LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNmRlNmIzOGUtMTc5ZS00ZjUxLTg0YmQtMzQ1M2UyNzc2ODA3IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiamF5YWtyaXNobmEiLCJzdWIiOiJmMTdiMWNiMC1lYmZmLTQ5NzMtODYyMy1lZThjZDFlZTIxZDkifSwiZW1haWwiOiJqYXlha3Jpc2huYV9ndWRlQHNybWFwLmVkdS5pbiIsIm5hbWUiOiJqYXlha3Jpc2huYSIsInJvbGxObyI6ImFwMjMxMTAwMTE2MzkiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiJmMTdiMWNiMC1lYmZmLTQ5NzMtODYyMy1lZThjZDFlZTIxZDkiLCJjbGllbnRTZWNyZXQiOiJBRGVIY2J1TlpudnlZUGdLIn0.vFTjG3t56gk0K0kOXsnnC8U7qcLmK17qynLaMKkE5XQ"; // paste your token here

async function fetchDepots() {
  await Log("backend", "info", "service", "Fetching depots");;

  const res = await axios.get(
    "http://20.207.122.201/evaluation-service/depots",
    {
      headers: { Authorization: `Bearer ${TOKEN}` },
    }
  );

  return res.data.depots;
}

async function fetchVehicles() {
  await Log("backend", "info", "service", "Fetching vehicles");

  const res = await axios.get(
    "http://20.207.122.201/evaluation-service/vehicles",
    {
      headers: { Authorization: `Bearer ${TOKEN}` },
    }
  );

  return res.data.vehicles;
}
async function testAPI() {
  try {
    const depots = await fetchDepots();
    const vehicles = await fetchVehicles();

    console.log("Depots:", depots.length);
    console.log("Vehicles:", vehicles.length);

    await Log("backend", "info", "service", "API working");
  } catch (err) {
    await Log("backend", "error", "handler", err.message);
    console.log(err.message);
  }
}
testAPI();