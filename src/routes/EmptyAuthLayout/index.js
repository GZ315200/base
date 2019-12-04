/**
 * @description 路由配置
 * @param {string}   path       跳转路径
 * @param {sting}    code       节点权限codePath
 * @param {function} component  路由对应的组件
 * @param {string}   redirect   重定向路径
 * @param {Array}    children   子菜单配置
 * @param {boolean}  ignoreAuth 忽略权限验证
 */

const routes = [
  // ... more routes
  {
    path: '/authEpt/dashboard',
    component: () => import('@src/pages/Dashboard'),
  },
]

export default routes
