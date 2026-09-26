// parse.js：解析（长选项可带等号值，短开关可黏连，取值项后值覆盖前值）
function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  throw error;
}

export function parseArgs(schema, argv) {
  const values = new Map();
  const switches = new Map();
  const positions = [];
  const words = argv || [];

  const bump = (name) => switches.set(name, (switches.get(name) || 0) + 1);

  const takeValue = (entry, inline, index) => {
    if (inline !== null) {
      values.set(entry.name, inline);
      return index;
    }
    const next = words[index + 1];
    if (next === undefined || next.startsWith("-")) {
      fail("E_MISSING_VALUE", "flag " + entry.name + " 缺值");
    }
    values.set(entry.name, next);
    return index + 1;
  };

  let onlyPositional = false;
  for (let index = 0; index < words.length; index += 1) {
    const word = words[index];
    if (onlyPositional) { positions.push(word); continue; }
    if (word === "--") { onlyPositional = true; continue; }
    if (word.startsWith("--")) {
      const eq = word.indexOf("=");
      const name = eq === -1 ? word.slice(2) : word.slice(2, eq);
      const entry = schema.longs.get(name);
      if (!entry) fail("E_UNKNOWN_FLAG", "不认识的长选项 --" + name);
      if (entry.takes_value) {
        index = takeValue(entry, eq === -1 ? null : word.slice(eq + 1), index);
      } else {
        if (eq !== -1) fail("E_UNKNOWN_FLAG", "开关 --" + name + " 不取值");
        bump(entry.name);
      }
    } else if (word.startsWith("-") && word.length > 1) {
      const cluster = word.slice(1);
      for (let spot = 0; spot < cluster.length; spot += 1) {
        const entry = schema.shortMap.get(cluster[spot]);
        if (!entry) fail("E_UNKNOWN_FLAG", "不认识的短选项 -" + cluster[spot]);
        if (entry.takes_value) {
          const rest = cluster.slice(spot + 1);
          index = takeValue(entry, rest === "" ? null : rest, index);
          break;
        }
        bump(entry.name);
      }
    } else {
      positions.push(word);
    }
  }
  return { values: Array.from(values), positions, switches: Array.from(switches) };
}
