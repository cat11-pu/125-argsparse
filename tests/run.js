import assert from "node:assert";
import { buildSchema } from "../schema.js";
import { parseArgs } from "../parse.js";
import { render } from "../app.js";

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

check("buildSchema returns lists", () => {
  assert.ok(Array.isArray(buildSchema([{ name: "a", short: "a", takes_value: false }]).names));
});

check("parseArgs returns positions", () => {
  const schema = buildSchema([]);
  assert.ok(Array.isArray(parseArgs(schema, ["x"]).positions));
});

check("parseArgs returns value pairs", () => {
  const schema = buildSchema([]);
  assert.ok(Array.isArray(parseArgs(schema, []).values));
});

check("render returns positional count", () => {
  assert.strictEqual(typeof render({ spec: { flags: [] }, argv: ["x"] }).positional_count, "number");
});

check("render exposes switch names", () => {
  assert.ok(Array.isArray(render({ spec: { flags: [] }, argv: [] }).switch_names));
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
