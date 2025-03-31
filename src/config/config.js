import { createRequire } from "module";
import { writeFileSync } from "fs";

// 加载配置文件
const require = createRequire(import.meta.url);
const config = require("../../config.json");

/**
 * 修改配置
 * @param {string} key - 配置项名称
 * @param {string} value - 配置项新值
 */
export function modify(key, value) {
  // 更新配置对象
  config[key] = value;

  // 写入配置文件
  writeFileSync("./config.json", JSON.stringify(config, null, "\t"), "utf-8");
}

// 导出配置对象
export { config };
