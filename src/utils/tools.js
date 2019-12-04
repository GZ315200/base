/* eslint-disable no-unused-vars */
import { getHeaderParams } from './validate'
// eslint-disable-next-line import/first
import { Message } from '@alifd/next'
// eslint-disable-next-line import/first
import request from '@src/utils/request'


export const showSuccess = msg => Message.success(msg)
export const showWarning = () => Message.warning('warning')
export const showError = error => Message.error(error)
export const showNotice = () => Message.notice('notice')
export const showHelp = () => Message.help('help')
export const showLoading = () => Message.loading('loading')

/**
 * @description 文件流下载
 * @author thomas.he
 * @param {object} response
 */
export const fileFlowDl = function (response) {
  const content = response.data
  let fileName = decodeURIComponent(response.headers['content-disposition'])
  fileName = fileName
    ? getHeaderParams('filename', fileName).replace(/"/g, '')
    : `${new Date().getTime()}.xlsx`
  const elink = document.createElement('a')
  elink.download = fileName
  elink.style.display = 'none'
  const blob = new Blob([content])
  elink.href = URL.createObjectURL(blob)
  document.body.appendChild(elink)
  elink.click()
  document.body.removeChild(elink)
}

export const filePreviewUrl = function (response) {
  const content = response.data
  const blob = new Blob([content])
  return URL.createObjectURL(blob)
}


export function errorHandler(error) {
  if (error.data) {
    switch (error.code) {
      case 403:
        showError('未登录或会话过期，请重新登录', 1)
        request({
          url: '/api/v1/logout',
          method: 'get',
        })
        localStorage.removeItem('tiket')
        break
      case 401:
        showError('您没有权限访问此数据', 1)
        break
      default:
        showError(error.errorMessage, 1)
        break
    }
  } else {
    showError(error.errorMessage, 1)
  }
}
