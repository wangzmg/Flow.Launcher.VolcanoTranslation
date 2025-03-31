/**
 * 火山引擎API请求处理模块
 * 负责API签名与请求发送，完全分离签名逻辑与业务逻辑
 */

import { Signer } from "@volcengine/openapi";
import axios from "axios";

// 火山引擎API配置
const API_CONFIG = {
  translate: {
    host: "open.volcengineapi.com",
    region: "cn-north-1",
    version: "2020-06-01",
  },
};

/**
 * 创建签名请求
 * @param {Object} options 请求选项
 * @param {string} options.service 服务名称，如 "translate"
 * @param {string} options.action API操作名，如 "TranslateText"
 * @param {Object} options.credentials 认证信息 {accessKeyId, secretKey}
 * @param {Object} options.data 请求体数据
 * @returns {Object} 已签名的请求信息，包含URL和Headers
 */
export function createSignedRequest(options) {
  const { service, action, credentials, data } = options;

  if (!API_CONFIG[service]) {
    throw new Error(`服务 "${service}" 未配置`);
  }

  const config = API_CONFIG[service];

  // 1. 创建请求描述
  const requestData = {
    method: "POST",
    region: config.region,
    params: {
      Action: action,
      Version: config.version,
    },
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
    pathname: "/",
  };

  // 2. 使用SDK签名器生成签名
  const signer = new Signer(requestData, service);
  signer.addAuthorization(credentials, new Date());

  // 3. 构建请求URL
  const queryParams = new URLSearchParams();
  Object.entries(requestData.params).forEach(([key, value]) => {
    queryParams.append(key, value);
  });

  const url = `https://${config.host}${
    requestData.pathname
  }?${queryParams.toString()}`;

  // 返回已签名的请求信息
  return {
    url: url,
    method: requestData.method,
    headers: requestData.headers,
    data: requestData.body,
  };
}

/**
 * 发送API请求
 * @param {Object} signedRequest 已签名的请求信息
 * @returns {Promise<Object>} 响应数据
 */
export async function sendRequest(signedRequest) {
  try {
    const response = await axios({
      method: signedRequest.method,
      url: signedRequest.url,
      headers: signedRequest.headers,
      data: signedRequest.data,
    });

    return response.data;
  } catch (error) {
    // 提取API错误信息
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      if (errorData.ResponseMetadata && errorData.ResponseMetadata.Error) {
        throw new Error(`API错误: ${errorData.ResponseMetadata.Error.Message}`);
      }
    }
    throw error;
  }
}

/**
 * 一步完成签名和发送请求
 * @param {Object} options 请求选项
 * @returns {Promise<Object>} 响应数据
 */
export async function callApi(options) {
  const signedRequest = createSignedRequest(options);
  return await sendRequest(signedRequest);
}
