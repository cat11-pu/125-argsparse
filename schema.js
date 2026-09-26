// schema.js：选项表（长名表与短名表都可查，每条记录是否取值）
export function buildSchema(flags) {
  const names = [];
  const shorts = [];
  const takes = [];
  const longs = new Map();
  const shortMap = new Map();
  for (const flag of flags || []) {
    const entry = { name: flag.name, short: flag.short || null, takes_value: !!flag.takes_value };
    names.push(entry.name);
    shorts.push(entry.short);
    takes.push(entry.takes_value);
    longs.set(entry.name, entry);
    if (entry.short) shortMap.set(entry.short, entry);
  }
  return { names, shorts, takes, longs, shortMap };
}
