import { createRequire } from "module";
import { writeFileSync } from "fs";

// 加载配置文件
const require = createRequire(import.meta.url);
const config = require("../../config.json");

/**
 * 修改配置
 * @param {object} settings - settings
 */
export function modify(settings) {
  // 更新配置对象
  // config[key] = value;

  // 写入配置文件
  writeFileSync("./config.json", JSON.stringify(settings, null, "\t"), "utf-8");
}

// 导出配置对象
export { config };
