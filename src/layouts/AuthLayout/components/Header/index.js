import React, { Component } from 'react'
import { connect } from 'dva'
import { Balloon, Icon, Breadcrumb } from '@alifd/next'
import FoundationSymbol from 'foundation-symbol'
import SelectLang from '@src/components/SelectLang'
import { FormattedMessage } from 'react-intl'
import request from '@src/utils/request'
import './index.scss'

@connect(({ global, user }) => ({ global, user }))
export default class Header extends Component {
  logOut = () => {
    request({
      url: '/api/v1/logout',
      method: 'get',
    })
  }
  render() {
    const {
      global: { crumbs, asideIconOnly },
      user: { userName },
      dispatch,
    } = this.props
    return (
      <div className="header-container">
        <div className="header-content">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              className={`iconfontES ${
                asideIconOnly ? 'iconmenu-unfold' : 'iconmenu-fold'
              }`}
              style={{
                width: '28px',
                cursor: 'pointer',
                marginRight: '20px',
                fontSize: '28px',
              }}
              onClick={() => {
                dispatch({
                  type: 'global/changeAsideStatus',
                  asideIconOnly: !asideIconOnly,
                })
              }}
            />

            {/* <Logo isDark /> */}
            <Breadcrumb maxNode={5}>
              {crumbs.map(({ link, name }, index) => {
                return (
                  <Breadcrumb.Item key={index} link={link}>
                    {name}
                  </Breadcrumb.Item>
                )
              })}
            </Breadcrumb>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* 多语言选择 */}
            <SelectLang />

            <Balloon
              trigger={
                <div
                  className="ice-design-header-userpannel"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 12,
                  }}
                >
                  <div className="user-profile">
                    <span className="user-name" style={{ fontSize: '13px' }}>
                      {userName}
                    </span>
                    <br />
                  </div>
                  <Icon
                    type="arrow-down-filling"
                    size="xxs"
                    className="icon-down"
                  />
                </div>
              }
              closable={false}
              className="user-profile-menu"
            >
              <ul>
                <li className="user-profile-menu-item">
                  <div onClick={this.logOut}>
                    <FoundationSymbol type="compass" size="small" />
                    <FormattedMessage
                      id="app.layout.basicLayout.header.logout"
                      desc="退出"
                    />
                  </div>
                </li>
              </ul>
            </Balloon>
          </div>
        </div>
      </div>
    )
  }
}
