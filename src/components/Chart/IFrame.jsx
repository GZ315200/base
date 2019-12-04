import React, { Component } from 'react'
import { connect } from 'dva'
import './index.scss'

@connect(({ global, iframeConfig }) => ({ global, iframeConfig }))
export default class IFrame extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      src: '',
    }
  }

  componentWillMount() {
    const { dispatch, match, iframeConfig } = this.props
    const path = match.path
    const menuData = iframeConfig.routerList
    const srcObj = this.getMenu(menuData, path)
    console.log('srcObj', srcObj)
    this.setState({
      title: srcObj.name,
      src: srcObj.iframeConfig,
    })
    dispatch({
      type: 'global/setCrumbs',
      crumbs: [{ link: '', name: `${srcObj.name}` }],
    })
  }

  getMenu = (menuData, path) => {
    let objSrc = {}
    if (Array.isArray(menuData) && menuData.length > 0) {
      menuData.forEach((item) => {
        if (path === item.path) {
          objSrc = { ...item }
        }
      })
    }
    return objSrc
  }

  render() {
    const { title, src } = this.state
    return (
      <div className="iframe-container">
        <iframe style={{ width: '100%', height: '100%' }} frameBorder={0} title={title} src={src} />
      </div>
    )
  }
}
