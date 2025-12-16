import controller from "infra/controllers.js";
import database from "infra/database";
import { createRouter } from "next-connect";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const updatedAt = new Date().toISOString();

  const dbVersion = await database.query("SHOW server_version;");
  const dbVersionValue = dbVersion.rows[0].server_version;

  const dbMaxConnections = await database.query("SHOW max_connections;");
  const dbMaxConnectionsValue = dbMaxConnections.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const dbOpenedConnetions = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const dbOpenedConnetionsValue = dbOpenedConnetions.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: dbVersionValue,
        max_connections: parseInt(dbMaxConnectionsValue),
        opened_connections: dbOpenedConnetionsValue,
      },
    },
  });
}
