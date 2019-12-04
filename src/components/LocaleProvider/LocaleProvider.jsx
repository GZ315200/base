/* eslint camelcase:0 */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { IntlProvider, addLocaleData } from 'react-intl'
import { ConfigProvider, Loading } from '@alifd/next'
import localeConfig from '@src/config/localeConfig'

class LocaleProvider extends PureComponent {
  constructor(props) {
    super(props)
    let { locale } = this.props
    if (!localeConfig[locale]) {
      locale = 'zh-CN'
    }

    const { [locale]: myLocaleConfig } = localeConfig

    this.state = {
      myLocale: null,
      isLoading: false,
    }

    setTimeout(() => {
      if (!this.state.myLocale) {
        this.setState({
          isLoading: true,
        })
      }
    }, 500)

    const isCustomNextLocale =
      Object.prototype.toString.call(myLocaleConfig.nextLocale) ===
      '[object Object]'

    Promise.all([
      myLocaleConfig.appLocaleFile(),
      myLocaleConfig.appMessagesFile(),
      isCustomNextLocale
        ? null
        : myLocaleConfig.nextLocaleFile(),
    ]).then((res) => {
      // console.log(res)
      const [appLocale, appMessages, nextLocale] = res

      addLocaleData([...appLocale.default])
      // 引入 react-intl 多语言包

      this.setState({
        myLocale: {
          nextLocale: isCustomNextLocale
            ? myLocaleConfig.nextLocale
            : nextLocale,
          appLocale: myLocaleConfig.appLocale,
          appMessages: appMessages.default,
        },
        isLoading: false,
      })
    })
  }
  render() {
    const { children } = this.props
    const { myLocale, isLoading } = this.state

    return (
      <Loading fullScreen visible={isLoading}>
        {myLocale ? (
          <IntlProvider
            locale={myLocale.appLocale}
            messages={myLocale.appMessages}
          >
            <ConfigProvider locale={myLocale.nextLocale}>
              {React.Children.only(children)}
            </ConfigProvider>
          </IntlProvider>
        ) : null}
      </Loading>
    )
  }
}

LocaleProvider.propTypes = {
  locale: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
}

export default LocaleProvider
