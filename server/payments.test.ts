import { describe, it, expect } from "vitest";
import dotenv from "dotenv";
dotenv.config();

describe("NOWPayments API key", () => {
  it("should have NOWPAYMENTS_API_KEY set", () => {
    expect(process.env.NOWPAYMENTS_API_KEY).toBeTruthy();
  });

  it("should have SITE_URL set", () => {
    expect(process.env.SITE_URL).toBeTruthy();
  });

  it("should be able to reach NOWPayments API with the provided key", async () => {
    const apiKey = process.env.NOWPAYMENTS_API_KEY;
    if (!apiKey) {
      throw new Error("NOWPAYMENTS_API_KEY not set");
    }

    const response = await fetch("https://api.nowpayments.io/v1/status", {
      headers: { "x-api-key": apiKey },
    });

    // NOWPayments returns 200 for valid keys and 401 for invalid
    expect(response.status).not.toBe(401);
    expect(response.status).toBe(200);
  }, 15000);
});
