import request from '../../../utils/request'
import api from '../../../utils/api'

export const ISaveMenu = record => request({ url: `${api.menus}`, method: 'put', data: record })
export const IUpdateMenu = record => request({ url: `${api.menus}`, method: 'post', data: record })
export const IGetMenu = () => request({ url: `${api.menus}`, method: 'get' })
export const IDeleteMenu = id => request({ url: `${api.menus}/${id}`, method: 'delete', id })
export const IGetTreeData = () => request({ url: `${api.treeData}`, method: 'get' })
export const ISearchData = menuName => request({ url: `${api.searchData}/${menuName}`, method: 'get' })
export const IGetAllMenusData = () => request({ url: `${api.menus}/all`, method: 'get' })
export const IGetMenuRouters = () => request({ url: `${api.menuRouters}`, method: 'get' })
export const ICheckName = (value, type, menuType) => request({ url: `${api.menus}/check/${type}/${menuType}?value=${value}`, method: 'get' })
