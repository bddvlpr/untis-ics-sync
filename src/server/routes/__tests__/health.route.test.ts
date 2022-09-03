import { Express } from "express";
import request from "supertest";
import { createApp } from "../..";

let app: Express;

beforeAll(() => {
  app = createApp();
});

describe("health.route.ts /health", () => {
  it("should return 200", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
  });
});
