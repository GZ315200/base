/**
 * @description 路由配置
 * @param {string}   name       显示menu文字
 * @param {string}   nameId     多语言字段id
 * @param {string}   path       跳转路径
 * @param {sting}    code       节点权限codePath
 * @param {function} component  路由对应的组件
 * @param {sting}    icon       icon配置
 * @param {boolean}  hideInMenu 侧边栏菜单中隐藏
 * @param {string}   redirect   重定向路径
 * @param {Array}    children   子菜单配置
 * @param {boolean}  ignoreAuth 忽略权限验证
 */

/*
  const routes = [
    {
      name: '例子',
      path: '/example',
      code: 'example',
      children: [
        {
          name: 'OForm',
          path: '/example/OForm',
          code: '/example/OForm',
          component: () => import('@src/pages/OForm'),
        },
      ]
    }
  ]
*/

const routes = [
  // ... more routes
  {
    name: '首页',
    path: '/dashboard',
    icon: 'iconhome',
    ignoreAuth: true,
    component: () => import('@src/pages/Dashboard'),
  },
  {
    name: '菜单管理',
    path: '/admin/menu',
    code: 'menuMgt',
    icon: '',
    ignoreAuth: false,
    component: () => import('@src/pages/admin/Menu'),
  },
  {
    name: '403',
    path: '/403',
    ignoreAuth: true,
    hideInMenu: true,
    component: () => import('@src/pages/403'),
  },
  {
    path: '/',
    ignoreAuth: true,
    hideInMenu: true,
    redirect: '/dashboard',
  },
]

export default routes
