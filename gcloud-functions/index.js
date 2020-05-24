const { Pool } = require("pg");

const pool = new Pool({
  host: "/cloudsql/wordsearch-172001:us-central1:analytics-1",
});

exports.eventsIngest = async (req, res) => {
  const origin = req.get("origin");
  const isAcceptedCorsOrigin = [
    "http://localhost:3000",
    "https://solver.0xcaff.me",
  ].includes(origin);
  if (isAcceptedCorsOrigin) {
    res.set("access-control-allow-origin", origin);
    res.set("vary", "origin");
  }

  switch (req.method) {
    case "OPTIONS":
      // CORS Preflight Request
      res.set("access-control-allow-methods", "POST");
      res.set("access-control-allow-headers", "content-type");

      res.send(204);
      return;

    case "POST":
      if (req.get("content-type") !== "application/json") {
        res.status(400).send("invalid content type");
        return;
      }

      const { userId, sessionId, events } = req.body;

      try {
        await pool.query(
          `
          INSERT INTO events (
            SELECT
              (data->>'name')::text,
              $1,
              $2,
              (data->>'timestamp')::timestamp with time zone,
              (data->>'properties')::json
            FROM
              json_array_elements($3::json) AS data
          )`,
          [userId, sessionId, JSON.stringify(events)]
        );
      } catch (e) {
        res.status(500).send("database error");
        console.error(e);
        return;
      }

      res.status(200).send("ok");
      return;

    default:
      res.status(400).send("only post accepted");
      return;
  }
};
