/**
 * GA4 统计（ID: G-6CLHE46347）
 * - 页面浏览：在 App.jsx 路由变化时自动上报 page_view
 * - 转化：表单提交成功时调用 trackFormSubmit；联络方式点击可调用 trackContact
 */

export function trackFormSubmit(formName = 'contact') {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'form_submit', {
      form_name: formName,
      page_location: window.location.pathname,
    })
    window.gtag('event', 'generate_lead', {
      method: 'form',
      form_name: formName,
      page_location: window.location.pathname,
    })
  }
}

export function trackContact(method) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', {
      method,
      page_location: window.location.pathname,
    })
  }
}
