// schema.js：选项表（基线：只认名字，不看短名与取值）
export function buildSchema(flags) {
  return { names: [], shorts: [], takes: [] };
}
