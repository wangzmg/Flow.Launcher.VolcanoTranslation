/**
 * 查询模块，处理用户输入并返回结果
 */

import { config } from "../config/config.js";
import { message } from "../common/message.js";
import { translate } from "./translate.js";
import { processUrl } from "../common/utils.js";

/**
 * 处理查询请求
 * @param {string} parameters - 用户输入的查询参数
 */
export async function query(parameters) {
  parameters = parameters.trim();

  // 如果参数为空，则返回提示
  if (!parameters) {
    return success([
      createResult(
        message.parameterNotFound,
        message.parameterNotFoundSubTitle,
        100
      ),
    ]);
  }

  // 处理配置查看
  if (
    parameters === "appid" ||
    parameters === "key" ||
    parameters === "dest" ||
    parameters === "url"
  ) {
    // 显示配置信息
    const value = config[parameters] || "未设置";
    let subtitle = `${parameters}的配置信息`;

    if (parameters === "url") {
      subtitle = message.urlConfigSubTitle;
    }

    return success([createResult(parameters + " " + value, subtitle, 100)]);
  }

  // 处理配置修改
  const splitParams = parameters.split(" ");
  if (
    splitParams.length >= 2 &&
    ["appid", "key", "dest", "url"].includes(splitParams[0])
  ) {
    // 对于url，可能包含空格，需要特殊处理
    const key = splitParams[0];
    const value = parameters.substring(key.length).trim();

    let subtitle = "点击此项或回车修改";
    if (key === "url") {
      subtitle = message.urlSetSubTitle;
    }

    return success([
      createResult(key + " " + value, subtitle, 100, {
        method: "modify",
        parameters: [key, value],
      }),
    ]);
  }

  try {
    // 调用翻译API
    const response = await translate(parameters);
    let result = [];

    if (!response.success) {
      // 处理错误情况
      const errorMessage = response.error;
      let subtitle = "点击查看API文档";

      if (errorMessage === message.appidOrKeyNotFound) {
        subtitle = message.appidOrKeyNotFoundSubTitle;
      }

      result = [
        createResult(errorMessage, subtitle, 100, {
          method: "open_url",
          parameters: [config.docUrl],
        }),
      ];
    } else if (response.data && response.data.length > 0) {
      // 处理成功情况
      result = response.data.map((translation, index) =>
        createResult(translation, `${parameters}`, 100 - index, {
          method: "copy",
          parameters: [translation],
        })
      );
    } else {
      // 没有结果的情况
      result = [createResult("没有获取到翻译结果", "请检查网络或API配置", 100)];
    }

    return success(result, parameters);
  } catch (error) {
    return success([
      createResult(
        "执行出错: " + (error.message || "未知错误"),
        "请检查插件代码",
        100
      ),
    ]);
  }
}

/**
 * 处理成功响应
 * @param {Array} result - 结果数组
 * @param {string} queryText - 查询文本，用于在线翻译URL
 */
function success(result, queryText = "") {
  // 只有在有查询文本时才添加在线翻译选项
  if (queryText) {
    const processedUrl = processUrl(config.url, queryText);
    result.push(
      createResult(message.tips, message.tipsSubTitle, 0, {
        method: "open_url",
        parameters: [processedUrl],
      })
    );
  }

  // 返回JSON结果给Flow Launcher
  console.log(JSON.stringify({ result }));
}

/**
 * 创建结果项
 */
function createResult(title, subTitle, score, jsonRPCAction) {
  return {
    Title: title,
    SubTitle: subTitle,
    IcoPath: "./src/assets/images/app.png",
    jsonRPCAction: jsonRPCAction,
    score: score,
  };
}
