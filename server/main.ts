// deno-lint-ignore-file no-explicit-any
import { Database } from "@db/sqlite";
import * as oak from "@oak/oak";
import * as path from "@std/path";
import { Port } from "../lib/utils/index.ts";
import { z } from "zod";
import * as insightsTable from "$tables/insights.ts";
import listInsights from "./operations/list-insights.ts";
import lookupInsight from "./operations/lookup-insight.ts";
import createInsight from "./operations/create-insight.ts";

console.log("Loading configuration");

const env = {
  port: Port.parse(Deno.env.get("SERVER_PORT")),
};

const dbFilePath = path.resolve("tmp", "db.sqlite3");

console.log(`Opening SQLite database at ${dbFilePath}`);

await Deno.mkdir(path.dirname(dbFilePath), { recursive: true });
const db = new Database(dbFilePath);
db.exec(insightsTable.createTable);

console.log("Initialising server");

const router = new oak.Router();

const InsightCreateRequest = z.object({
  brandId: z.number().int().min(0),
  date: z.string(),
  text: z.string(),
});

const _InsightDeleteRequest = z.object({
  brandId: z.number().int().min(0)
});

router.get("/_health", (ctx) => {
  ctx.response.body = "OK";
  ctx.response.status = 200;
});


router.get("/insights", (ctx) => {
  const result = listInsights({ db });
  ctx.response.body = result;
  ctx.response.body = 200;
});

router.get("/insights/:id", (ctx) => {
  const params = ctx.params as Record<string, any>;
  const result = lookupInsight({ db, id: params.id });
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.post("/insights/create",async (ctx) => {
  const body = await ctx.request.body.json();
  const parsed = InsightCreateRequest.parse(body);

  createInsight({
    db,
    insight: {
      brand: parsed.brandId,
      createdAt: new Date(parsed.date).toISOString(),
      text: parsed.text,
    },
  });

  ctx.response.status = 201;
  ctx.response.body = { ok: true };
});

router.get("/insights/delete", (ctx) => {
  // TODO
});

const app = new oak.Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(env);
console.log(`Started server on port ${env.port}`);
