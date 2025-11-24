import database from "infra/database.js";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("drop schema public cascade; create schema public;");
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      test("For the firs time", async () => {
        const response1Body = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        expect(response1Body.status).toBe(201);

        const response1BodyBody = await response1Body.json();
        expect(Array.isArray(response1BodyBody)).toBe(true);
        expect(response1BodyBody.length).toBeGreaterThan(0);
      });
      test("For the second time", async () => {
        const response2Body = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        expect(response2Body.status).toBe(200);

        const response2BodyBody = await response2Body.json();
        expect(Array.isArray(response2BodyBody)).toBe(true);
        expect(response2BodyBody.length).toBe(0);
      });
    });
  });
});
