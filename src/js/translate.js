/**
 * 翻译服务入口模块
 * 负责处理用户输入、配置读取和调用翻译服务
 */

import { config } from "../config/config.js";
import { message } from "../common/message.js";
import { translate as translateApi } from "./translate-service.js";

/**
 * 调用火山引擎翻译API获取翻译结果
 * @param {string} text - 要翻译的文本
 * @returns {Promise<{success: boolean, data: Array<string>, error?: string}>} 翻译结果或错误信息
 */
export async function translate(text) {
  try {
    const results = await callTranslationAPI(text);
    return {
      success: true,
      data: Array.isArray(results) ? results : [results],
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "翻译过程中发生未知错误",
      data: [],
    };
  }
}

/**
 * 调用火山翻译API
 * @param {string} text 要翻译的文本
 * @returns {Promise<string|string[]>} 翻译结果
 */
async function callTranslationAPI(text) {
  try {
    // 验证凭证 - 入口层面的参数检查
    if (!config.appid || !config.key) {
      throw new Error(message.appidOrKeyNotFound);
    }

    // 入口统一处理认证信息
    const credentials = {
      accessKeyId: config.appid,
      secretKey: config.key,
    };

    // 处理输入文本，提取可能的语言代码和实际要翻译的文本
    const { cleanedText, detectedLang } = processInputText(text);

    // 入口统一处理目标语言 - 确保始终有一个有效值
    // 设置语言优先级: 1. 文本中检测到的语言代码, 2. 配置中设置的目标语言, 3. 基于输入自动判断目标语言
    let targetLang = detectedLang || config.dest;

    if (!targetLang) {
      // 如果仍然没有目标语言，根据文本内容判断
      const hasChinese = /[\u4e00-\u9fa5]/.test(cleanedText);
      targetLang = hasChinese ? "en" : "zh";
    }

    // 源语言始终保持为null，由API自动检测
    const sourceLang = null;

    // 调用翻译API - 传递已处理好的所有参数
    return await translateApi(cleanedText, targetLang, sourceLang, credentials);
  } catch (error) {
    // 处理API错误，保持与原有错误处理逻辑一致
    if (error.message.includes("API错误")) {
      throw error;
    }

    // 特殊处理身份验证错误
    if (
      error.message.includes("InvalidAuthorization") ||
      error.message.includes("signature") ||
      error.message.includes("Authorization")
    ) {
      throw new Error(message.appidOrKeyNotFound);
    }

    throw error;
  }
}

/**
 * 处理输入文本，提取目标语言代码和需要翻译的文本
 * @param {string} text 原始输入文本
 * @returns {{cleanedText: string, detectedLang: string|null}} 处理后的文本和检测到的语言代码
 */
function processInputText(text) {
  if (!text) {
    return { cleanedText: "", detectedLang: null };
  }

  // 移除开头和结尾的空格
  const trimmedText = text.trim();

  // 支持的语言代码列表
  const supportedLangs = [
    "zh",
    "en",
    "ja",
    "ko",
    "fr",
    "es",
    "it",
    "de",
    "ru",
    "pt",
    "vi",
    "id",
    "th",
    "ms",
  ];

  // 检查是否以语言代码开头，后面跟着空白字符
  const langCodeRegex = new RegExp(
    `^(${supportedLangs.join("|")})\\s+(.+)$`,
    "i"
  );
  const match = trimmedText.match(langCodeRegex);

  if (match) {
    // 提取语言代码和实际要翻译的文本
    const langCode = match[1].toLowerCase();
    const actualText = match[2].trim();
    return { cleanedText: actualText, detectedLang: langCode };
  }

  // 未检测到特定格式，返回原始文本
  return { cleanedText: trimmedText, detectedLang: null };
}
