/** 是否微信内置浏览器（含企业微信等基于微信内核的环境） */
export function isWeChatBrowser() {
  if (typeof navigator === 'undefined') return false
  return /MicroMessenger/i.test(navigator.userAgent || '')
}
