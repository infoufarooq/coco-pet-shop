import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function GET() {
  const healthData = {
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    mode: "dual-mode",
    environment: process.env.NODE_ENV || "development",
  };

  logger.info("Health check endpoint accessed", { status: "ok" });

  return NextResponse.json(healthData, { status: 200 });
}
