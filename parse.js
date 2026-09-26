// parse.js：解析（基线：全部当位置参数）
import { buildSchema } from "./schema.js";

export function parseArgs(schema, argv) {
  return { values: [], positions: argv.slice(), switches: [] };
}
