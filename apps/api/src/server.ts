import { createServer, type ServerResponse } from "node:http";
import { getDemoMaintenanceData } from "@appfolio-ai/core";

const port = Number(process.env.PORT ?? 4000);

const server = createServer((request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);

  response.setHeader("Access-Control-Allow-Origin", process.env.WEB_ORIGIN ?? "http://localhost:3000");
  response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }

  if (request.method === "GET" && url.pathname === "/health") {
    sendJson(response, 200, {
      status: "ok",
      service: "@appfolio-ai/api",
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/maintenance/demo") {
    sendJson(response, 200, getDemoMaintenanceData());
    return;
  }

  sendJson(response, 404, {
    error: "not_found",
    message: "Route not found"
  });
});

server.listen(port, () => {
  console.log(`AppFolio AI API listening on http://localhost:${port}`);
});

function sendJson(response: ServerResponse, statusCode: number, body: unknown) {
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.end(JSON.stringify(body, null, 2));
}
