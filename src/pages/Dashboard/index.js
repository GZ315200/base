import React, { Component } from 'react'
import { connect } from 'dva'
import { injectIntl, FormattedMessage } from 'react-intl'
import dashboardLogo from '@src/assets/img/dashboard/dashboard_logo.png'
import footerImg from '@src/assets/img/dashboard/bottom.png'
import './index.scss'

@connect(({ user }) => ({ global, user }))
@injectIntl
export default class Page extends Component {
  constructor(props) {
    super(props)
    const { dispatch } = props
    dispatch({
      type: 'global/setCrumbs',
      crumbs: [{ link: '', name: '首页' }],
    })
  }
  render() {
    const {
      user: { userName },
    } = this.props
    return (
      <div className="dashboard-container">
        <img className="dashboard_logo" src={dashboardLogo} alt="logo" />
        <div className="welcome_content">
          {userName ? <p className="username">{userName}，您好！</p> : ''}
          <p className="welcome_text">
            <FormattedMessage id="app.dashboard.welcome" />
          </p>
        </div>
        <img className="footer" src={footerImg} alt="logo" />
      </div>
    )
  }
}
