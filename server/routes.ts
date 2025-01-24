import type { Express } from "express";
import { createServer, type Server } from "http";
import { Connection } from "@solana/web3.js";

export function registerRoutes(app: Express): Server {
  const solanaConnection = new Connection(
    process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com"
  );

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  const httpServer = createServer(app);
  return httpServer;
}