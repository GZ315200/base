/* eslint no-undef:0, no-unused-expressions:0, array-callback-return:0 */
import { Link, withRouter } from 'react-router-dom'
import { Nav } from '@alifd/next'
import React, { Fragment, useState, useEffect, useRef } from 'react'
import { connect } from 'dva'
import logo from '@src/assets/img/logo.png'
import logoText from '@src/assets/img/logo_text.png'
import menusData from '@src/routes/AuthLayout'
import { injectIntl, FormattedMessage } from 'react-intl'
import './index.scss'

const SubNav = Nav.SubNav
const NavItem = Nav.Item


const hasChildren = (children, authTree) => {
  if (!Array.isArray(children) || children.length === 0) return false
  return children.some(({ hideInMenu, code, ignoreAuth }) => {
    return !hideInMenu && (ignoreAuth)
  })
}

const DefaultIcon = injectIntl((props) => {
  const {
    intl: { formatMessage },
    name,
    nameId,
  } = props
  return (
    <i
      className="iconfontES"
      style={{
        fontSize: '12px',
        width: '18px',
        height: '18px',
        lineHeight: '16px',
        textAlign: 'center',
        border: '1px solid',
        borderRadius: '100%',
      }}
    >
      {nameId ? formatMessage({ id: nameId }).substr(0, 1) : name.substr(0, 1)}
    </i>
  )
})

const loopNav = (menus, authTree, currentPath, isNeedAddIcon = true) => {
  return menus.map((menuItem) => {
    const {
      name,
      nameId,
      path,
      redirect,
      icon,
      code,
      children,
      hideInMenu,
      ignoreAuth,
    } = menuItem
    if (ignoreAuth && !hideInMenu) {
      const defaultIcon =
        isNeedAddIcon && name ? (
          <DefaultIcon name={name} nameId={nameId} />
        ) : null
      if (children && hasChildren(children, authTree)) {
        const subNavProps = {
          key: path,
          label: nameId ? <FormattedMessage id={nameId} /> : name,
        }
        icon
          ? (subNavProps.icon = <i className={`iconfontES ${icon}`} />)
          : (subNavProps.icon = defaultIcon)
        return (
          <SubNav {...subNavProps}>
            {loopNav(children, authTree, currentPath, false)}
          </SubNav>
        )
      } else if (!children) {
        const itemPath = redirect || path
        const navItemProps = { key: path }
        icon
          ? (navItemProps.icon = <i className={`iconfontES ${icon}`} />)
          : (navItemProps.icon = defaultIcon)
        return (
          <NavItem {...navItemProps}>
            <Link to={itemPath} replace={itemPath === currentPath}>
              <span>{nameId ? <FormattedMessage id={nameId} /> : name}</span>
            </Link>
          </NavItem>
        )
      }
    }
    return null
  })
}

const getDefaultOpenKeys = (menus, currentPath) => {
  const openKeys = []
  const matchItem = menus.find(({ path }) => {
    return currentPath.startsWith(path) && path !== '/' && currentPath !== path
  })

  if (matchItem) {
    const { path, children } = matchItem
    if (Array.isArray(children) && children.length > 0) {
      return [path, ...getDefaultOpenKeys(children, currentPath)]
    }
    return [path]
  }

  return openKeys
}

const getSelectKey = (menus, currentPath) => {
  const matchItem = menus.find(({ path, redirect }) => {
    return currentPath.startsWith(redirect || path) && path !== '/'
  })

  if (matchItem) {
    const { path, children, hideInMenu } = matchItem
    if (path === currentPath) {
      if (hideInMenu) {
        return
      }
      return path
    }
    if (Array.isArray(children) && children.length > 0) {
      const childRes = getSelectKey(children, currentPath)
      return childRes || path
    }
  }
}


export default withRouter(
  connect(({ global, user, menus }) => ({ global, user, menus }))((props) => {
    const {
      global: { asideIconOnly },
      user: { authTree },
      location: { pathname: currentPath },
      menus: { data },
    } = props
    const defaultOpenKeys = getDefaultOpenKeys(menusData, currentPath)
    const [openKeys, setOpenKeys] = useState(
      asideIconOnly ? [] : defaultOpenKeys
    )
    const cacheOpenKeys = useRef(openKeys)
    useEffect(() => {
      if (asideIconOnly) {
        cacheOpenKeys.current = openKeys
        setOpenKeys([])
      } else {
        setOpenKeys(cacheOpenKeys.current)
      }
    }, [asideIconOnly])

    const selectKey = getSelectKey(menusData, currentPath)
    // const routers = getRoutersTreeData()
    // console.log('routers => ', routers)
    const menusResult = [...menusData, ...data]
    return (
      <Fragment>
        <Link to="/" className="aside-logo">
          <img
            className="logo-img"
            src={asideIconOnly ? logo : logoText}
            alt="dv-logo"
          />
          {asideIconOnly ? null : <h1 className="project-name">DV Cover</h1>}
        </Link>
        <Nav
          className={`dvcover-nav ${asideIconOnly ? 'aside-icon-only' : ''}`}
          style={{ width: 255 }}
          mode={asideIconOnly ? 'popup' : 'inline'}
          triggerType={asideIconOnly ? 'hover' : 'click'}
          activeDirection={null}
          iconOnly={asideIconOnly}
          hasTooltip={asideIconOnly}
          popupAlign="follow"
          hasArrow={false}
          selectedKeys={[selectKey]}
          defaultSelectedKeys={[selectKey]}
          openKeys={openKeys}
          onOpen={(keys) => {
            setOpenKeys(keys)
          }}
        >
          {loopNav(menusResult, authTree, currentPath)}
        </Nav>
      </Fragment>
    )
  })
)
