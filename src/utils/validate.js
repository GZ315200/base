/**
 * @description form验证
 */

export function isvalidUsername(email) {
  const emailReg = /^[a-zA-Z0-9_.-]+@dvcover.cn|@dvcover.cn$/
  return emailReg.test(email)
}

export function checkPhone(phone) {
  return /^1\d{10}$/.test(phone)
}

/* 合法uri */
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母 */
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母 */
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母 */
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/* 获取hash连接url参数 */
export function getQueryString(name, type) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  let r = null
  switch (type) {
    case 'hash':
      r = decodeURI(location.hash).replace(/#.+\?/, '').match(reg)
      break
    case 'search':
      r = decodeURI(location.search).substr(1).match(reg)
      break
    default:
      r = decodeURI(location.search).substr(1).match(reg)
      break
  }
  if (r != null) return unescape(r[2])
  return ''
}

export function rmUrlParams(name, url) {
  const decodeUrl = decodeURIComponent(url)
  const centerParamReg = new RegExp(`(${name}=.+&)`, 'gi')
  const lastParamReg = new RegExp(`(${name}=.+)`, 'gi')
  let returnUrl = ''
  if (centerParamReg.test(decodeUrl)) {
    returnUrl = decodeUrl.replace(centerParamReg, '')
  } else {
    returnUrl = decodeUrl.replace(lastParamReg, '')
    if (returnUrl.substr(returnUrl.length - 1, 1) === '&') {
      returnUrl = returnUrl.substr(0, returnUrl.length - 1)
    }
    // returnUrl.substr(returnUrl.length - 1, 1) === '&' ? returnUrl = returnUrl.substr(0, returnUrl.length - 1) : returnUrl
  }
  return isNeedSearch(returnUrl)
}

function isNeedSearch(url) {
  const decodeUrl = decodeURIComponent(url)
  if (/\?.+/.test(decodeUrl)) {
    return decodeUrl
  }
  return decodeUrl.replace(/\?/, '')
}

export function isAuth(codePath, authTree) {
  let isAuthCode = true
  if (authTree === null) {
    return isAuthCode
  }
  if (!Array.isArray(codePath) || codePath.length === 0) {
    return false
  }
  let bpAuthTree = {
    ...authTree,
  }
  codePath = codePath.filter(item => item)
  for (let i = 0, len = codePath.length; i < len; i += 1) {
    if (bpAuthTree === null) {
      break
    }

    const treeKeys = Object.keys(bpAuthTree)
    if (treeKeys.includes(codePath[i])) {
      // bpAuthTree[codePath[i]] === null 表示下层节点都拥有权限，null 是缪斯系统的一个特殊预定的返回值，需要严格匹配
      bpAuthTree = bpAuthTree[codePath[i]] === null ? null : {
        ...bpAuthTree[codePath[i]],
      }
    } else {
      isAuthCode = false
      break
    }
  }
  return isAuthCode
}

/* 获取header参数 */
export function getHeaderParams(name, header) {
  const reg = new RegExp(`(^|; ?)${name}=([^;]*)(;|$)`, 'i')
  const nameVal = header.match(reg)
  if (nameVal != null) return unescape(nameVal[2])
  return ''
}
