const { Pool } = require("pg");

const pool = new Pool({
  host: "/cloudsql/wordsearch-172001:us-central1:analytics-1",
});

exports.eventsIngest = async (req, res) => {
  if (req.get("content-type") !== "application/json") {
    res.status(400).send("invalid content type");
    return;
  }

  if (res.method !== "POST") {
    res.status(400).send("only post accepted");
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
      )
    `,
      [userId, sessionId, JSON.stringify(events)]
    );
  } catch (e) {
    res.status(500).send("database error");
    console.error(e);
    return;
  }

  res.status(200).send("ok");
};
