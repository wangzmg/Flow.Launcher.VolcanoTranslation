/**
 * 消息常量定义
 */
export const message = {
  // 提示信息
  tips: "在线翻译",
  tipsSubTitle: "回车打开浏览器",

  // 错误信息
  parameterNotFound: "请输入要翻译的文本",
  parameterNotFoundSubTitle: `例如: y hello world`,

  appidOrKeyNotFound: "API凭证未配置",
  appidOrKeyNotFoundSubTitle:
    "使用'tr appid 你的APPID'和'tr key 你的KEY'进行设置",

  // URL配置
  urlNotFound: "在线翻译URL未配置",
  urlNotFoundSubTitle: "使用'tr url 你的URL'进行设置，URL中用{q}表示搜索词",
  urlConfig: "当前在线翻译URL",
  urlConfigSubTitle: "回车修改URL，URL中用{q}表示搜索词",
  urlSet: "在线翻译URL已设置",
  urlSetSubTitle: "URL中请使用{q}作为搜索词的占位符",

  // 其他提示消息
  openDoc: "打开文档",
  openDocSubTitle: "查看插件使用说明",
};
