/**
 * 定义应用路由
 */
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import React from 'react'
import AuthLayout from '@src/layouts/AuthLayout'
// import EmptyAuthLayout from '@src/layouts/EmptyAuthLayout'
// 按照 Layout 分组路由
// AuthLayout 对应的路由：/xxx
const router = () => {
  return (
    <Router>
      <Switch>
        {/* <Route path="/menus" component={EmptyAuthLayout} /> */}
        <Route path="/" component={AuthLayout} />
      </Switch>
    </Router>
  )
}

export default router
