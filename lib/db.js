import { MongoClient } from "mongodb";

if (!global._mongo) global._mongo = new MongoClient(process.env.MONGODB_URI).connect();
let ready;

export async function db() {
  const client = await global._mongo;
  const d = client.db("logit");
  if (!ready) {
    ready = Promise.all([
      d.collection("users").createIndex({ username: 1 }, { unique: true }),
      d.collection("plays").createIndex({ gameId: 1, username: 1 }, { unique: true }),
    ]);
  }
  await ready;
  return d;
}
