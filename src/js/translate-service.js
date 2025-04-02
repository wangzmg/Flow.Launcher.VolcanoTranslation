/**
 * 火山引擎翻译服务模块
 * 专注于翻译业务逻辑，与API请求签名逻辑完全分离
 */

import { callApi } from "./volcano-api.js";

/**
 * 调用文本翻译API
 * @param {Object} params 请求参数
 * @param {string} params.TargetLanguage 目标语言
 * @param {string[]} params.TextList 要翻译的文本列表
 * @param {Object} credentials 认证信息
 * @returns {Promise<Object>} 翻译结果
 */
export async function TranslateText(params, credentials) {
  // 构建请求数据 - 直接使用传入的参数，不做额外判断
  const requestData = {
    TextList: params.TextList,
    TargetLanguage: params.TargetLanguage,
  };

  // 调用API
  return await callApi({
    service: "translate",
    action: "TranslateText",
    credentials: credentials,
    data: requestData,
  });
}

/**
 * 简易翻译函数 - 方便直接调用
 * @param {string|string[]} text 要翻译的文本或文本数组
 * @param {string} targetLang 目标语言代码
 * @param {Object} credentials 认证信息
 * @returns {Promise<string|string[]>} 翻译后的文本或文本数组
 */
export async function translate(text, targetLang, credentials) {
  // 统一处理输入格式
  const isArray = Array.isArray(text);
  const textList = isArray ? text : [text];

  // 构建参数 - 目标语言应该在上层已经处理好，此处直接使用
  const params = {
    TextList: textList,
    TargetLanguage: targetLang,
  };

  // 调用API
  const result = await TranslateText(params, credentials);

  // 处理返回结果
  if (!result.TranslationList || result.TranslationList.length === 0) {
    throw new Error("翻译失败：没有返回翻译结果");
  }

  /**
   * 火山翻译API返回结构（已通过测试验证）:
   * {
   *   "TranslationList": [
   *     {
   *       "Translation": "翻译结果",
   *       "DetectedSourceLanguage": "检测到的源语言",
   *       "Extra": null  // 额外信息，通常为null
   *     },
   *     ...
   *   ],
   *   "ResponseMetadata": {...}  // 请求元数据
   * }
   *
   * 注意: API只会返回单一的翻译结果，不提供多个备选翻译
   */

  // 返回翻译结果
  if (isArray) {
    // 如果输入是数组，返回所有翻译结果的数组
    return result.TranslationList.map((item) => {
      return item.Translation || "无翻译结果";
    });
  } else {
    // 如果输入是单个文本，返回第一个翻译结果
    const firstItem = result.TranslationList[0] || {};
    return firstItem.Translation || "无翻译结果";
  }
}
