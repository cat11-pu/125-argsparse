// app.js：渲染结果
import { buildSchema } from "./schema.js";
import { parseArgs } from "./parse.js";

export function render(spec) {
  const schema = buildSchema((spec.spec && spec.spec.flags) || []);
  const view = parseArgs(schema, spec.argv || []);
  const names = view.values.map((pair) => pair[0]).slice().sort();
  const byName = new Map(view.values.map((pair) => [pair[0], pair[1]]));
  const switchPairs = view.switches.slice().sort((left, right) => (left[0] < right[0] ? -1 : 1));
  return { value_names: names, value_values: names.map((name) => byName.get(name)),
           switch_names: switchPairs.map((pair) => pair[0]),
           switch_counts: switchPairs.map((pair) => pair[1]),
           positionals: view.positions, positional_count: view.positions.length };
}
