// 载入默认全局样式 normalize 、.clearfix 和一些 mixin 方法等
// import '@alifd/next/dist/next.css'
import '@alifd/next/reset.scss'
import '@src/assets/defaultFont/iconfont.css'
import React from 'react'
import dva from 'dva'
// import moment from 'moment'
import LanguageProvider from '@src/components/LocaleProvider'
import { getLocale } from '@src/utils/locale'
import { createBrowserHistory as createHistory } from 'history'
import router from './router'
import models from './models/index'

// moment.locale('zh-cn', {
//   months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split(
//     '_'
//   ),
//   monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
//   weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
//   weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
//   weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
// })

const app = dva({
  history: createHistory(),
})
const locale = getLocale()

if (Array.isArray(models)) {
  models.forEach((item) => {
    app.model(item)
  })
}

const ICE_CONTAINER = document.getElementById('ice-container')

if (!ICE_CONTAINER) {
  throw new Error('当前页面不存在 <div id="ice-container"></div> 节点.')
}

app.router(() => {
  return <LanguageProvider locale={locale}>{router()}</LanguageProvider>
})
app.start('#ice-container')
