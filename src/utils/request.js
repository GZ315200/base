import axios from 'axios'
import {
  Message,
} from '@alifd/next'
import moment from 'moment'
import {
  promiseErrorWrapper,
} from './errorHelper'

// 创建axios实例
const service = axios.create({
  baseURL: '', // api 的 base_url
  timeout: 20000, // 请求超时时间
})

const timezone = moment().format('Z')

// request拦截器
service.interceptors.request.use(
  (config) => {
    config.isRequestEnd = false // 标记这次请求是否结束
    // getQueryString('ticket', 'hash')
    config.headers = {
      ...config.headers,
      ...{
        redirect_uri: `${location.origin}/#/`,
        token: localStorage.getItem('token'),
        lang: localStorage.getItem('lang') || '',
        timezone,
      },
    }

    return config
  },
  (error) => {
    // Do something with request error
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  (response) => {
    /**
     * code为非000是抛错
     */

    if (response.config.responseType === 'blob') return response

    const res = response.data
    const resCode = parseInt(res.code, 0)
    if (resCode === 200) {
      if (res.msg) {
        Message.success(res.msg)
      }
      return response
    } else if (resCode === 3002) {
      if (response.config.url === '/api/v1/logout') {
        localStorage.setItem('token', '')
      }
      // 重定向地址
      const {
        data,
      } = res
      location.href = data
    } else {
      Message.error(res.msg)
      return Promise.reject(res)
    }
  },
  (error) => {
    Message.error(error.message)
    return Promise.reject(error)
  }
)

export default service

const errorWrappedRequest = (config) => {
  return promiseErrorWrapper(service(config))
}

export {
  errorWrappedRequest,
}
