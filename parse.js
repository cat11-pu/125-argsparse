// parse.js：解析（长选项 --name[=value]，短开关可黏合 -vv，位置参数按序收集）
function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

export function parseArgs(schema, argv) {
  const values = new Map();
  const switches = new Map();
  const positions = [];
  const args = argv || [];
  let onlyPositional = false;

  function bump(name) {
    switches.set(name, (switches.get(name) || 0) + 1);
  }

  function takeValue(name, inline, index) {
    if (inline !== null) return { value: inline, next: index };
    const word = args[index + 1];
    if (word === undefined || (word.length > 0 && word[0] === "-")) {
      throw fail("E_MISSING_VALUE", "选项 --" + name + " 缺值");
    }
    return { value: word, next: index + 1 };
  }

  for (let index = 0; index < args.length; index++) {
    const word = args[index];
    if (onlyPositional) { positions.push(word); continue; }
    if (word === "--") { onlyPositional = true; continue; }

    if (word.startsWith("--")) {
      const cut = word.indexOf("=");
      const name = cut === -1 ? word.slice(2) : word.slice(2, cut);
      const entry = schema.byName.get(name);
      if (!entry) throw fail("E_UNKNOWN_FLAG", "不认识的选项 --" + name);
      if (entry.takes_value) {
        const got = takeValue(entry.name, cut === -1 ? null : word.slice(cut + 1), index);
        values.set(entry.name, got.value);
        index = got.next;
      } else {
        bump(entry.name);
      }
      continue;
    }

    if (word.length > 1 && word[0] === "-") {
      const cluster = word.slice(1);
      for (let spot = 0; spot < cluster.length; spot++) {
        const entry = schema.byShort.get(cluster[spot]);
        if (!entry) throw fail("E_UNKNOWN_FLAG", "不认识的选项 -" + cluster[spot]);
        if (entry.takes_value) {
          const inline = spot + 1 < cluster.length ? cluster.slice(spot + 1) : null;
          const got = takeValue(entry.name, inline, index);
          values.set(entry.name, got.value);
          index = got.next;
          break;
        }
        bump(entry.name);
      }
      continue;
    }

    positions.push(word);
  }

  return { values: Array.from(values), positions, switches: Array.from(switches) };
}
