const STATE_KEY = "inventory-manager:shared-state:v1";

const EMPTY_STATE = {
  salesRecords: [],
  manualMovements: [],
  updatedAt: "",
};

function getRedisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error("Redis environment variables are missing.");
  }
  return { url: url.replace(/\/$/, ""), token };
}

async function redisCommand(command) {
  const { url, token } = getRedisConfig();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  const payload = await response.json();
  if (payload.error) {
    throw new Error(payload.error);
  }
  return payload.result;
}

function normalizeState(input) {
  return {
    salesRecords: Array.isArray(input?.salesRecords) ? input.salesRecords : [],
    manualMovements: Array.isArray(input?.manualMovements) ? input.manualMovements : [],
    updatedAt: typeof input?.updatedAt === "string" ? input.updatedAt : "",
  };
}

module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const result = await redisCommand(["GET", STATE_KEY]);
      const state = result ? normalizeState(JSON.parse(result)) : EMPTY_STATE;
      res.status(200).json(state);
      return;
    }

    if (req.method === "PUT" || req.method === "POST") {
      const state = normalizeState(req.body || {});
      await redisCommand(["SET", STATE_KEY, JSON.stringify(state)]);
      res.status(200).json({ ok: true, updatedAt: state.updatedAt });
      return;
    }

    res.setHeader("Allow", "GET, PUT, POST");
    res.status(405).send("Method Not Allowed");
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message || "Server error");
  }
};
