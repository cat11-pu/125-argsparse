// ui.js：操作面板与视图（原生 DOM，无弹窗）
import { render } from "./app.js";

export function mount(spec, parts) {
  let text = (spec.argv || []).join(" ");
  parts.log.textContent = "参数 " + (spec.argv || []).length + " 个，点解析看结果。";

  function draw() {
    const scene = Object.assign({}, spec, { argv: text.split(/\s+/).filter(Boolean) });
    let view = null;
    try {
      view = render(scene);
    } catch (error) {
      parts.out.textContent = String(error && error.code ? error.code : error);
      parts.log.textContent = "跑不动：" + String(error && error.message ? error.message : error);
      return;
    }
    parts.out.textContent = JSON.stringify(view, null, 1);
    parts.stage.textContent = "";
    view.value_names.forEach(function (name, spot) {
      const row = document.createElement("div");
      row.className = "row";
      const head = document.createElement("span");
      head.textContent = name;
      row.appendChild(head);
      const mark = document.createElement("span");
      mark.className = "chip ok";
      mark.textContent = String(view.value_values[spot]);
      row.appendChild(mark);
      parts.stage.appendChild(row);
    });
    const line = document.createElement("div");
    line.className = "row";
    line.textContent = "开关 " + JSON.stringify(view.switch_names) + " 次数 "
      + JSON.stringify(view.switch_counts) + "；位置参数 " + JSON.stringify(view.positionals);
    parts.stage.appendChild(line);
    parts.legend.textContent = "取值项 " + view.value_names.length + " 个，位置参数 " + view.positional_count + " 个";
    parts.log.textContent = "不认识的写法会报 " + spec.unknown_error_code + "，缺值会报 " + spec.missing_error_code;
  }

  const runButton = document.createElement("button");
  runButton.className = "primary";
  runButton.textContent = "解析这串参数";
  runButton.addEventListener("click", draw);
  parts.controls.appendChild(runButton);

  const addButton = document.createElement("button");
  addButton.textContent = "追加一个开关";
  addButton.addEventListener("click", function () {
    text = text + " -v";
    draw();
  });
  parts.controls.appendChild(addButton);

  const label = document.createElement("label");
  label.textContent = "参数串";
  parts.controls.appendChild(label);

  const box = document.createElement("input");
  box.type = "text";
  box.value = text;
  box.addEventListener("input", function () {
    text = box.value;
    draw();
  });
  parts.controls.appendChild(box);

  const readButton = document.createElement("button");
  readButton.textContent = "只看位置参数";
  readButton.addEventListener("click", function () {
    const scene = Object.assign({}, spec, { argv: text.split(/\s+/).filter(Boolean) });
    const view = render(scene);
    parts.out.textContent = "位置参数 " + JSON.stringify(view.positionals);
  });
  parts.controls.appendChild(readButton);

  draw();
}
