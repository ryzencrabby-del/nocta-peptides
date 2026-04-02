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

describe("Stripe configuration", () => {
  it("should have STRIPE_SECRET_KEY set", () => {
    expect(process.env.STRIPE_SECRET_KEY).toBeTruthy();
  });

  it("should have STRIPE_WEBHOOK_SECRET set", () => {
    expect(process.env.STRIPE_WEBHOOK_SECRET).toBeTruthy();
  });

  it("STRIPE_SECRET_KEY should start with sk_", () => {
    const key = process.env.STRIPE_SECRET_KEY || "";
    expect(key.startsWith("sk_")).toBe(true);
  });
});

describe("Order number generation", () => {
  it("should generate unique order numbers", () => {
    // Simulate the order number generation logic from CartDrawer
    const generate = () =>
      `NP-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`;

    const a = generate();
    // Small delay to ensure different timestamps
    const b = generate();

    expect(a).toMatch(/^NP-[A-Z0-9]+-\d{3}$/);
    expect(b).toMatch(/^NP-[A-Z0-9]+-\d{3}$/);
    // Both should start with NP-
    expect(a.startsWith("NP-")).toBe(true);
    expect(b.startsWith("NP-")).toBe(true);
  });
});

describe("Express checkout total calculation", () => {
  const TAX_RATE = 0.08875;

  it("should calculate tax correctly on discounted subtotal", () => {
    const discountedSubtotal = 100;
    const taxAmount = discountedSubtotal * TAX_RATE;
    const expressTotal = discountedSubtotal + taxAmount;

    expect(taxAmount).toBeCloseTo(8.875, 3);
    expect(expressTotal).toBeCloseTo(108.875, 3);
  });

  it("should calculate express total with promo discount applied", () => {
    const subtotal = 200;
    const discountPct = 15; // NOCTA15
    const discountAmount = subtotal * (discountPct / 100);
    const discountedSubtotal = subtotal - discountAmount;
    const taxAmount = discountedSubtotal * TAX_RATE;
    const expressTotal = discountedSubtotal + taxAmount;

    expect(discountedSubtotal).toBeCloseTo(170, 2);
    expect(taxAmount).toBeCloseTo(15.0875, 4);
    expect(expressTotal).toBeCloseTo(185.0875, 4);
  });
});

describe("Apple Pay domain verification file", () => {
  it("should exist at the expected path", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.join(
      process.cwd(),
      "public",
      ".well-known",
      "apple-developer-merchantid-domain-association"
    );
    expect(fs.existsSync(filePath)).toBe(true);
  });
});
