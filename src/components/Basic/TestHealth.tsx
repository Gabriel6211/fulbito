"use client";

import { testDbConnection } from "@/services/healthService";
import React, { useState, useEffect } from "react";

interface DbConnectionResponse {
  status: string;
  message: string;
}

export default function TestHealth() {
  const [connectionStatus, setConnectionStatus] = useState<DbConnectionResponse>({
    status: "not finished",
    message: "Checking...",
  });
  useEffect(() => {
    async function fetchConnectionStatus() {
      try {
        const result = await testDbConnection();
        setConnectionStatus(result);
      } catch (error) {
        console.error("Error fetching connection status:", error);
      }
    }
    fetchConnectionStatus();
  }, []);
  return <div>{connectionStatus.message}</div>;
}
