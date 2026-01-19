import http from "node:http";
import { URL } from "node:url";

const PORT = 8081;

function round1(v) { return Math.round(v * 10) / 10; }
function base(location) {
  if (location === "Living Room") return 22.0;
  if (location === "Bedroom") return 20.5;
  if (location === "Kitchen") return 24.0;
  return 21.0;
}
function locBySensor(id) {
  if (id === "1") return "Living Room";
  if (id === "2") return "Bedroom";
  if (id === "3") return "Kitchen";
  return "Unknown";
}
function sensorByLoc(location) {
  if (location === "Living Room") return "1";
  if (location === "Bedroom") return "2";
  if (location === "Kitchen") return "3";
  return "0";
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "GET" && url.pathname === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("ok");
  }

  if (req.method === "GET" && url.pathname === "/temperature") {
    let location = url.searchParams.get("location") || "";
    let sensorId = url.searchParams.get("sensorId") || url.searchParams.get("sensorID") || "";

    if (!location) location = locBySensor(sensorId);
    if (!sensorId) sensorId = sensorByLoc(location);

    const noise = (Math.random() * 6) - 3; // [-3; +3)
    const temperatureC = round1(base(location) + noise);

    const body = JSON.stringify({
      location,
      sensorId,
      temperatureC,
      tsUtc: new Date().toISOString()
    });

    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Content-Length": Buffer.byteLength(body)
    });
    return res.end(body);
  }

  res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify({ error: "Not Found" }));
});

server.listen(PORT, () => console.log(`temperature-api listening on :${PORT}`));
