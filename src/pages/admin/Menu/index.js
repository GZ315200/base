/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-unused-vars */
/* eslint-disable import/first */

import React, { Component } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import './index.scss'
import {
  Input, Button, Icon, Tag, Switch,
  Table, Dialog, Form, Radio, NumberPicker, TreeSelect,
} from '@alifd/next'
import { ISaveMenu, IUpdateMenu, IGetMenu, IDeleteMenu, IGetTreeData,
  ISearchData, IGetAllMenusData, IGetMenuRouters } from './requests'

import { errorHandler } from '@src/utils/tools'
import { showSuccess, showError } from '../../../utils/tools'
import { Type } from './config'
import { connect } from 'dva'


const FormItem = Form.Item
const RadioGroup = Radio.Group

@connect(({ global, user, menus, iframeConfig }) => ({ global, user, menus, iframeConfig }))
@injectIntl
export default class Menu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: Type.MENU,
      typeId: 1,
      visible: false,
      operateType: Type.ADD,
      dataSource: [],
      treeData: [],
      isTree: true,
      id: 0,
      fType: 0,
      name: '',
      parentName: '',
      parentId: 0,
      path: '',
      component: '',
      iframeConfig: '',
      sort: 0,
      disableMenu: false,
      disableCatelog: false,
      changeType: <FormattedMessage id="app.menu.tag.fold" />,
      treeValue: [],
      hasExpandedRowCtrl: false,
      submitDisabled: true,
    }
    const { dispatch } = props
    dispatch({
      type: 'global/setCrumbs',
      crumbs: [{ link: '/admin/menu', name: '菜单管理' }],
    })
  }

  onChangeSwitch = (value) => {
    const switchType = value
    // console.log('=======', switchType)
    if (switchType) {
      // console.log('true =>', switchType)
      this.setState({
        dataSource: [],
        changeType: <FormattedMessage id="app.menu.tag.expand" />,
      })
      this.onGetAllMenusData()
    } else {
      // console.log('false =>', switchType)
      this.setState({
        dataSource: [],
        changeType: <FormattedMessage id="app.menu.tag.fold" />,
      })
      this.getTableDatasource()
    }
  }

  onOpen = () => {
    this.toGetTreeData()
    this.onChangeType(this.state.typeId)
    this.setState({
      operateType: Type.ADD,
      visible: true,
      id: 0,
      fType: 0,
      name: '',
      parentName: '',
      parentId: 0,
      path: '',
      component: '',
      iframeConfig: '',
      sort: 0,
      disableMenu: false,
      disableCatelog: false,
      treeValue: [],
      submitDisabled: true,
    })
  }


  onClose = () => {
    this.setState({
      visible: false,
      typeId: 1,
    })
  }

  updateMenusInRedux = () => {
    const { dispatch } = this.props
    IGetMenuRouters().then((res) => {
      const { data, code } = res.data
      if (code === 200) {
        dispatch({
          type: 'menus/saveMenusInfo',
          menusInfo: {
            data,
          },
        })
      }
    }).catch((error) => {
      errorHandler(error)
    })
  }

  saveMenuConfig = (obj) => {
    const { valType, valName, valCompponent, valPath,
      valCatalogSort, valMenuSort, valParentMenu, iframeConfig } = obj
    const { id } = this.state
    if (id > 0) {
      if (Number(valType) === 0) {
        const record = {
          id,
          name: valName,
          type: valType,
          url: valPath,
          component: valCompponent,
          parentId: valParentMenu[0] || 0,
          sort: Number(valCatalogSort),
        }
        IUpdateMenu(record).then((res) => {
          const { errorMessage, code } = res.data
          if (code === 200) {
            showSuccess('update the catalog info sucessful.')
            this.getTableDatasource()
            this.updateMenusInRedux()
            this.onClose()
          } else {
            showError(errorMessage)
          }
        }).catch((err) => {
          errorHandler(err)
        })
      }
      if (Number(valType) === 1) {
        const params = {
          id,
          name: valName,
          type: valType,
          url: valPath,
          component: valCompponent,
          parentId: valParentMenu[0],
          sort: Number(valMenuSort),
          iframeConfig,
        }
        IUpdateMenu(params).then((res) => {
          const { errorMessage, code } = res.data
          if (code === 200) {
            showSuccess('update the menu info sucessful.')
            this.getTableDatasource()
            this.updateMenusInRedux()
            this.onClose()
          } else {
            showError(errorMessage)
          }
        }).catch((err) => {
          errorHandler(err)
        })
      }
    } else {
      if (Number(valType) === 0) {
        const record = {
          name: valName,
          type: valType,
          url: valPath,
          component: valCompponent,
          parentId: valParentMenu[0] || 0,
          sort: Number(valCatalogSort),
        }
        ISaveMenu(record).then((res) => {
          const { errorMessage, code } = res.data
          if (code === 200) {
            showSuccess('save the catalog info sucessful.')
            this.getTableDatasource()
            this.updateMenusInRedux()
            this.onClose()
          } else {
            showError(errorMessage)
          }
        }).catch((err) => {
          errorHandler(err)
        })
      }
      if (Number(valType) === 1) {
        const params = {
          name: valName,
          type: valType,
          url: valPath,
          component: valCompponent,
          parentId: valParentMenu[0],
          sort: Number(valMenuSort),
          iframeConfig,
        }
        ISaveMenu(params).then((res) => {
          const { errorMessage, code } = res.data
          if (code === 200) {
            showSuccess('save the menu info sucessful.')
            this.getTableDatasource()
            this.updateMenusInRedux()
            this.onClose()
          } else {
            showError(errorMessage)
          }
        }).catch((err) => {
          errorHandler(err)
        })
      }
    }
  }

  onChangeType = (typeId) => {
    if (Number(typeId) === 0) {
      this.setState({
        type: Type.CATALOG,
      })
    }
    if (Number(typeId) === 1) {
      this.setState({
        type: Type.MENU,
      })
    }
  }

  componentDidMount = () => {
    this.getTableDatasource()
  }
  /**
   *
   *获取table的数据源
   */
  getTableDatasource() {
    IGetMenu().then((res) => {
      const { data, code, errorMessage } = res.data
      if (code === 200) {
        this.setState({
          dataSource: data,
        })
      } else {
        showError(errorMessage)
      }
    }).catch((err) => {
      errorHandler(err)
    })
  }


  onRemoveItem = (id) => {
    IDeleteMenu(id).then((res) => {
      const { code, errorMessage } = res.data
      if (code === 200) {
        showSuccess(errorMessage)
        this.getTableDatasource()
        this.updateMenusInRedux()
      } else {
        showError(errorMessage)
      }
    }).catch((err) => {
      errorHandler(err)
    })
  }

  toGetTreeData = () => {
    IGetTreeData().then((res) => {
      const { data, code, errorMessage } = res.data
      if (code === 200) {
        this.setState({
          treeData: data,
        })
      } else {
        showError(errorMessage)
      }
    }).catch((err) => {
      errorHandler(err)
    })
  }

  onEditItem = (record) => {
    const { id, type, name, parentId, parentName, sort, url, iframeConfig, component } = record
    this.toGetTreeData()
    this.onChangeType(type)
    this.setState({
      visible: true,
      typeId: Number(type),
      id,
      operateType: Type.EDIT,
      name,
      parentName,
      fType: type,
      path: url,
      sort,
      iframeConfig,
      component,
      disableMenu: type === 1,
      disableCatelog: type === 0,
      treeValue: [String(parentId)],
      submitDisabled: true,
    })
  }

  onSearchData = (menuName) => {
    this.setState({
      dataSource: [],
    })
    if (menuName == null || menuName === '') {
      this.getTableDatasource()
    } else {
      ISearchData(menuName).then((res) => {
        const { data, errorMessage, code } = res.data
        if (code === 200) {
          this.setState({
            dataSource: data,
          })
        } else {
          showError(errorMessage)
        }
      }).catch((error) => {
        errorHandler(error)
      })
    }
  }

  onSearchName = (name) => {
    this.setState({
      name,
    })
  }

  onChangeName = (name) => {
    this.setState({
      name,
      submitDisabled: false,
    })
  }

  onChangeUrl = (path) => {
    this.setState({
      path,
      submitDisabled: false,
    })
  }

  onChangeComponent = (component) => {
    this.setState({
      component,
      submitDisabled: false,
    })
  }

  onChangeIframeConfig = (iframeConfig) => {
    this.setState({
      iframeConfig,
      submitDisabled: false,
    })
  }

  onChangeSort = (sort) => {
    this.setState({
      sort,
      submitDisabled: false,
    })
  }

  onChangeParentName = (treeData) => {
    this.setState({
      treeData,
      submitDisabled: false,
    })
  }

  onHandlerTreeValue = (treeValue) => {
    this.setState({
      treeValue,
      submitDisabled: false,
    })
  }

  onClickSearch = () => {
    const { name } = this.state
    this.onSearchData(name)
  }

  onGetAllMenusData = () => {
    IGetAllMenusData().then((res) => {
      const { data, errorMessage, code } = res.data
      if (code === 200) {
        this.setState({
          dataSource: data,
        })
      } else {
        showError(errorMessage)
      }
    }).catch((err) => {
      errorHandler(err)
    })
  }

  render() {
    const { operateType, visible, type, typeId, dataSource, treeData, disableCatelog, disableMenu,
      name, path, sort, iframeConfig, component, treeValue, isTree, changeType, submitDisabled } = this.state

    const home = [{ label: '根目录', value: ['0'], children: treeData }]
    let newTreeData = []
    newTreeData = [...home]

    // console.log('treevalue =>', typeof (treeValue))
    const newTreeValue = typeof treeValue === 'string' ? [treeValue] : treeValue

    // console.log('newTreeValue =>', newTreeValue)
    // console.log('datasource =>', dataSource)
    const operate = (value, index, record) => {
      return (
        <div className="operate-container">
          <Button className="operate-left-btn" type="normal" onClick={this.onEditItem.bind(this, record)}><Icon type="edit" />编辑</Button>
          <Button className="operate-right-btn" type="primary" onClick={this.onRemoveItem.bind(this, record.id)}><Icon type="ashbin" />删除</Button>
        </div>
      )
    }

    const renderType = (value, index, record) => {
      return Number(record.type) === 0 ? <Tag size="small">{Type.CATALOG}</Tag> : <Tag size="small">{Type.MENU}</Tag>
    }

    return (
      <div className="menu-container">
        <div className="filter-container">
          <Input onPressEnter={this.onClickSearch} className="filter-item-input" size="medium" placeholder="请输入菜单名" onChange={this.onSearchName} />
          <Button className="filter-item-search" type="primary" onClick={this.onClickSearch} ><Icon type="search" />查找</Button>
          <Button className="filter-item-add" type="primary" onClick={this.onOpen}><Icon type="add" />添加目录/菜单</Button>
          <Dialog
            title={operateType}
            visible={visible}
            onClose={this.onClose}
            style={{ width: 450 }}
            footer={false}
          >
            <Form labelCol={{ span: 6 }}>
              <FormItem
                label={`${type}类型: `}
                hasFeedback
                required
                requiredMessage="Please select your menu type."
              >
                <RadioGroup name="valType" onChange={this.onChangeType} defaultValue={typeId} >
                  <Radio disabled={disableMenu} value={0}>{Type.CATALOG}</Radio>
                  <Radio disabled={disableCatelog} value={1}>{Type.MENU}</Radio>
                </RadioGroup>
              </FormItem>

              <FormItem
                label={`${type}名称: `}
                hasFeedback
                required
                requiredMessage="Please input your menu name"
              >
                <Input placeholder="Input your menu name" trim name="valName" value={name} onChange={this.onChangeName} />
              </FormItem>

              <FormItem
                label={`上级${type}: `}
              >
                <TreeSelect value={newTreeValue} onChange={this.onHandlerTreeValue} treeDefaultExpandAll={false} dataSource={type === Type.CATALOG ? newTreeData : treeData} name="valParentMenu" style={{ width: 200 }} />
              </FormItem>

              <FormItem
                label={`${type}路径: `}
              >
                <Input value={path} trim onChange={this.onChangeUrl} placeholder="Input your menu path" name="valPath" />
              </FormItem>

              {type === Type.CATALOG ? null : (
                <FormItem
                  label={`${type}组件: `}
                >
                  <Input value={component} trim onChange={this.onChangeComponent} placeholder="Input your menu component" name="valCompponent" />
                </FormItem>
              )}

              {type === Type.CATALOG ? null : (
                <FormItem
                  label="嵌套页面配置: "
                  hasFeedback
                  format="url"
                >
                  <Input value={iframeConfig} trim onChange={this.onChangeIframeConfig} placeholder="Input your iframe url" name="iframeConfig" />
                </FormItem>
              )}

              {type === Type.CATALOG ? (
                <FormItem
                  label="排序编号: "
                >
                  <NumberPicker value={sort} type="inline" onChange={this.onChangeSort.bind(this)} name="valCatalogSort" min={0} style={{ minWidth: '25%' }} />
                </FormItem>
              ) : (
                <FormItem
                  label="排序编号: "
                >
                  <NumberPicker value={sort} type="inline" onChange={this.onChangeSort.bind(this)} name="valMenuSort" min={0} max={6} style={{ minWidth: '25%' }} />
                </FormItem>
                )}
              <FormItem wrapperCol={{ offset: 16 }}>
                <Form.Submit disabled={submitDisabled} validate type="primary" onClick={this.saveMenuConfig} style={{ marginRight: 10 }} > 确认</Form.Submit>
                <Button onClick={this.onClose}> 取消</Button>
              </FormItem>
            </Form>
          </Dialog>

          <Tag className="filter-item-tag" type="normal" >{changeType}</Tag>
          <Switch className="filter-item-switch"
            defaultChecked={false}
            size="small"
            onChange={this.onChangeSwitch.bind(this)}
          />
        </div>

        <div className="table-container">
          <div className="table-item">
            <Table dataSource={dataSource}
              hasBorder={false}
              hasExpandedRowCtrl={false}
              indent={1}
              size="small"
              isTree={isTree}
              fixedHeader
              maxBodyHeight={750}
              expandedRowIndent={[4, 2]}
            >
              <Table.Column title="名称" align="center" dataIndex="name" width={100} />
              <Table.Column title="类型" align="center" dataIndex="type" cell={renderType} width={100} />
              <Table.Column title="上级菜单" align="center" dataIndex="parentName" width={100} />
              <Table.Column title="菜单路径" align="center" dataIndex="url" width={100} />
              <Table.Column title="菜单组件" align="center" dataIndex="component" width={100} />
              <Table.Column title="嵌套页面配置" align="left" dataIndex="iframeConfig" width={450} />
              <Table.Column title="排序" align="center" dataIndex="sort" width={50} />
              <Table.Column title="操作" align="center" cell={operate} width={200} />
            </Table>
          </div>
        </div>
      </div>
    )
  }
}
