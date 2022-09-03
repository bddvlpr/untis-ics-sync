import { Express } from "express";
import request from "supertest";
import { createApp } from "../..";

let app: Express;

beforeAll(() => {
  app = createApp();
});

describe("classes.route.ts /classes", () => {
  it("should return 200", async () => {
    const response = await request(app).get("/classes");
    expect(response.status).toBe(200);
  });
  it("should return an array", async () => {
    const response = await request(app).get("/classes");
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe("classes.route.ts /classes/search", () => {
  it("should return 500", async () => {
    const response = await request(app).get("/classes/search");
    expect(response.status).toBe(400);
  });
  it("should return 200 if parameters are applied", async () => {
    const response = await request(app).get("/classes/search?name=ITSOF");
    expect(response.status).toBe(200);
  });
  it("should return an array", async () => {
    const response = await request(app).get("/classes/search?name=ITSOF");
    expect(response.body).toBeInstanceOf(Array);
  });
});
