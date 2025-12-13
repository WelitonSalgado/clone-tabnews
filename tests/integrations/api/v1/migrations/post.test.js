import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      test("For the firs time", async () => {
        const responseBody = await fetch(
          "http://localhost:3000/api/v1/migrations",
          { method: "POST" },
        );
        expect(responseBody.status).toBe(201);

        const responseBodyBody = await responseBody.json();
        expect(Array.isArray(responseBodyBody)).toBe(true);
        expect(responseBodyBody.length).toBeGreaterThan(0);
      });
      test("For the second time", async () => {
        const responseBody = await fetch(
          "http://localhost:3000/api/v1/migrations",
          { method: "POST" },
        );
        expect(responseBody.status).toBe(200);

        const responseBodyBody = await responseBody.json();
        expect(Array.isArray(responseBodyBody)).toBe(true);
        expect(responseBodyBody.length).toBe(0);
      });
    });
  });
});
