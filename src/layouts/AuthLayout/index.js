/* eslint-disable no-underscore-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint no-undef:0, no-unused-expressions:0, array-callback-return:0 */
import React, { Component } from 'react'
import Layout from '@icedesign/layout'
import { connect } from 'dva'
import request from '@src/utils/request'
import { Loading } from '@alifd/next'
import Header from './components/Header'
import AsideNav from './components/Aside'
import MainRoutes from './MainRoutes'
import './index.scss'

const { Section, Main, Aside } = Layout

/**
 * 创建树节点
 *
 * @param {Array} nodeNata
 * @returns
 */
const createTreeNode = (nodeNata) => {
  if (nodeNata === null) return null

  if (Array.isArray(nodeNata) && nodeNata.length > 0) {
    const nodeObj = {}
    nodeNata.forEach(({ code, resourceTrees }) => {
      nodeObj[code] = createTreeNode(resourceTrees)
    })
    return nodeObj
  }
  return {}
}

@connect(({ user, menus }) => ({ user, menus }))
export default class AuthLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoadingUser: true,
    }
  }
  componentDidMount = async () => {
    try {
      const res = await request({
        url: '/api/v1/userInfo',
        method: 'get',
      })

      const menuResult = await request({
        url: '/api/v1/menus/getRouters',
        method: 'get',
      })

      const { data } = menuResult.data
     
      const { userId, userName, roles, resourceTree } = res.data.data
      const { ticket } = res.config.headers

      // const { childern } = routers.data.data
  
      const treeArr =
      resourceTree && JSON.parse(resourceTree).code
        ? JSON.parse(resourceTree).resourceTrees
        : []

      let authTree = {}

      authTree = createTreeNode(treeArr)

      const { dispatch } = this.props
      dispatch({
        type: 'user/saveUserInfo',
        userInfo: {
          userId,
          userName,
          roles,
          authTree,
        },
      })

      dispatch({
        type: 'menus/saveMenusInfo',
        menusInfo: {
          data,
        },
      })

      this.setState({
        isLoadingUser: false,
      })

      localStorage.setItem('token', ticket)
    } catch (err) {
      console.log(err)
      this.setState({
        isLoadingUser: false,
      })
      request({
        url: '/api/v1/logout',
        method: 'get',
      }).then(() => {
        localStorage.setItem('token', '')
      })
      // 获取用户失败自动登出
    }
  }

  render() {
    const { isLoadingUser } = this.state
    return isLoadingUser ? (
      <Loading tip="Loading Auth ..." fullScreen />
    ) : (
      <Layout fixable style={styles.layout}>
        <Aside theme="light" className="custom-aside">
          <AsideNav />
        </Aside>

        <Section>
          <Header />
          <Main scrollable style={styles.main}>
            <MainRoutes />
          </Main>
        </Section>
      </Layout>
    )
  }
}

const styles = {
  main: {
    padding: '20px',
    position: 'relative',
    background: '#f5f5f5',
  },
  layout: {
    flexDirection: 'row',
  },
}
