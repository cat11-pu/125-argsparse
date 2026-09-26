// schema.js：选项表（长名表 + 短名表，可查是否取值）
export function buildSchema(flags) {
  const names = [];
  const shorts = [];
  const byName = new Map();
  const byShort = new Map();
  for (const flag of flags || []) {
    const entry = { name: flag.name, short: flag.short, takes_value: !!flag.takes_value };
    names.push(entry.name);
    shorts.push(entry.short);
    byName.set(entry.name, entry);
    byShort.set(entry.short, entry);
  }
  return { names, shorts, byName, byShort };
}
