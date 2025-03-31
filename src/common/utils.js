/**
 * 处理URL中的占位符
 */
export function processUrl(urlTemplate, query) {
  if (!urlTemplate) return "";
  return urlTemplate.replace(/\{q\}/g, encodeURIComponent(query));
}
