import React, { Component } from 'react'
import { Select } from '@alifd/next'
import LOCALE_CONFIG from '@src/config/localeConfig'
import { getLocale, setLocale } from '@src/utils/locale'

const Option = Select.Option

export default class SelectLang extends Component {
  changeLang = (key) => {
    setLocale(key)
  };

  render() {
    const selectedLang = getLocale()
    return (
      <Select
        onChange={this.changeLang}
        value={selectedLang}
        size="small"
        style={{ display: 'flex', alignItems: 'center' }}
      >
        {Object.keys(LOCALE_CONFIG).map((lang) => {
          return (
            <Option value={lang} key={lang}>
              {LOCALE_CONFIG[lang].text}
            </Option>
          )
        })}
      </Select>
    )
  }
}
