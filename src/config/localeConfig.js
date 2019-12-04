export default {
  'zh-CN': {
    text: '简体中文',
    icon: '🇨🇳',
    // nextLocale: {}, // 在node_modules/@alifd/next/lib/locale没有对应的语言包的情况下，可以自定义
    nextLocaleFile: () => import('@alifd/next/lib/locale/zh-cn.js'), // node_modules/@alifd/next/lib/locale 下找对应的文件名
    appMessagesFile: () => import('@src/locales/zh-CN'), //  下找对应的文件名
    appLocale: 'zh', // node_modules/react-intl/locale-data 找对应文件名
    appLocaleFile: () => import('react-intl/locale-data/zh'), // 对应appLocale的文件路径
  },
  'en-US': {
    text: 'English',
    icon: '🇬🇧',
    nextLocaleFile: () => import('@alifd/next/lib/locale/en-us.js'),
    appMessagesFile: () => import('@src/locales/en-US'),
    appLocale: 'en',
    appLocaleFile: () => import('react-intl/locale-data/en'),
  },
}
