import React, { lazy, Suspense } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import routes from '@src/routes/AuthLayout'
import { connect } from 'dva'
import PageLoading from '@src/components/PageLoading'
import './index.scss'

const NotFound = lazy(() => import('@src/components/NotFound'))
const IFrame = lazy(() => import('@src/components/Chart'))

const RouteItem = (props) => {
  const { redirect, path: routePath, component, key, exact, iframeConfig } = props
  if (redirect) {
    return <Redirect exact key={key} from={routePath} to={redirect} />
  }
  if (component) {
    return (
      <Route
        key={key}
        component={lazy(component)}
        path={routePath}
        exact={exact}
      />
    )
  }
  if (iframeConfig) {
    return (
      <Route
        key={key}
        component={IFrame}
        path={routePath}
        exact={exact}
      />
    )
  }
  return null
}

const flatRoutes = (routesSource, authTree) => {
  let filterRoutes = []
  routesSource.forEach((route) => {
    const { redirect, path, code, component, children, exact, ignoreAuth, iframeConfig, name } = route
    if (ignoreAuth) {
      filterRoutes.push({
        key: path,
        path,
        redirect,
        component,
        exact,
        iframeConfig,
        name,
      })
    }
    if (Array.isArray(children) && children.length > 0) {
      filterRoutes = [...filterRoutes, ...flatRoutes(children, authTree)]
    }
  })
  return filterRoutes
}


export default connect(({ user, menus }) => ({ user, menus }))((props) => {
  const {
    user: { authTree },
    menus: { data },
    dispatch,
  } = props

  const routerList = flatRoutes([...routes, ...data], authTree)
  dispatch({
    type: 'iframeConfig/saveIframeConfig',
    iframeConfigInfo: {
      routerList,
    },
  })
  return (
    <Suspense fallback={<PageLoading />}>
      <Switch >
        {/* 渲染路由表 */}

        {routerList.map(RouteItem)}

        {/* 未匹配到的路由重定向到 NotFound */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  )
})
