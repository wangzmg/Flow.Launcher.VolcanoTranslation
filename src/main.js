import { query } from "./js/query.js";
import { exec } from "child_process";
import { modify } from "./config/config.js";
import open from "open";

// 从Flow Launcher接收的参数
const { method, parameters, settings } = JSON.parse(process.argv[2]);

if (settings) {
  modify(settings);
}

// 方法分发处理
switch (method) {
  case "query":
    // 处理翻译查询请求
    query(parameters[0]);
    break;
  case "open_url":
    // 打开URL
    open(parameters[0]);
    break;
  case "copy":
    // 复制到剪贴板
    exec(`echo ${parameters[0]} | clip`);
    break;
}
