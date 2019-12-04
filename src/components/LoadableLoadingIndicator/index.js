import React from 'react'
import { injectIntl } from 'react-intl'

const LoadableLoadingIndicator = ({ intl }) => {
  return (
    <div>
      {intl.formatMessage({
        id: 'app.components.loadableLoading',
        desc: '页面加载中',
      })}
      ...
    </div>
  )
}

export default injectIntl(LoadableLoadingIndicator)
