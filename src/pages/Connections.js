/**
 * 配置页
 * */
'use strict'

import React, { Component } from 'react'
import classNames from 'classnames'

// ui
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Theme from './comm/Theme'

// 布局
import Grid from '@material-ui/core/Grid'

import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText/ListItemText'

import TextField from '@material-ui/core/TextField'

// 提示条
import Tip from './comm/Tip'

import Button from '@material-ui/core/Button'
// icon
import LibraryAddIco from '@material-ui/icons/LibraryAdd'
import LibraryBooksIco from '@material-ui/icons/LibraryBooks'
// ui end

// 逻辑
const connModel = require('../models/connections')

// import './App.css';

const drawerWidth = 240

class Connections extends Component {
  constructor (props) {
    super(props)

    this.state = {
      mobileOpen: false,
      selectedID: 0, // 连接列表里当前被选中的连接id
      nowEditIndex: -1, // 当前正在编辑的连接index，-1为都没有编辑
      connections: connModel.get(), // 所有连接

      tipMessage: '', // 提示语
      tipType: 'info',

      delConfirm: false
    }
  }

  componentDidMount () {
    // 最后一个为true，则是捕获，会先执行这里的代码，再执行打开按钮的事件，所以无需停止冒泡，
    // ps. 一个问题：如果点击某DOM触发了window点击事件，而window点击事件中删除了那个DOM，那个DOM本身的点击事件就不会执行（可以肯定事件被触发了，但是并不执行）
    // ps. 原生的DOM对象即使被删除，已经产生的事件依然会执行
    window.addEventListener('click', this.closeFloatThings.bind(this), true)
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.closeFloatThings.bind(this), true)
  }

  // 关闭所有浮动的东西
  closeFloatThings () {
    this.setState({
      delConfirm: false
    })
  }

  openDelComfirm () {
    this.setState({
      delConfirm: true
    })
  }

  // 添加新连接
  addNewConnect (e) {
    this.setState(state => {
      state.connections.push(connModel.create())
      state.nowEditIndex = state.connections.length - 1
      state.selectedID = state.connections[state.nowEditIndex].id
      return state
    })
  }

  selectConnect (event, id, index) {
    this.setState({
      selectedID: id,
      nowEditIndex: index
    })
  }

  /**
   * 构建连接s列表的jsx
   * */
  connectionsJSX () {
    const t = this
    const jsxs = []
    t.state.connections.some((item, i) => {
      jsxs.push((
        <ListItem
          button
          selected={t.state.selectedID === item.id}
          onClick={event => this.selectConnect(event, item.id, i)}
          key={item.id}>
          <ListItemIcon>
            <LibraryBooksIco />
          </ListItemIcon>
          <ListItemText primary={item.name} />
        </ListItem>
      ))
    })
    return jsxs
  }

  // 生成编辑面板
  editorJSX () {
    const { classes } = this.props
    if (this.state.nowEditIndex < 0) {
      return (
        <Typography variant='body1' gutterBottom>请新建连接或者选择连接</Typography>
      )
    }
    const nowEdit = this.state.connections[this.state.nowEditIndex]
    if (!nowEdit) {
      return (
        <Typography variant='body1' gutterBottom>该连接出错，请重试</Typography>
      )
    }

    /*
    * {
      id: maxID + 1,
      name: '新连接',
      host: '',
      port: '',
      auth: ''
    }
    * */
    return (<div className={classes.container}>
      {[{
        label: '连接名称',
        name: 'name'
      }, {
        label: '连接地址',
        name: 'host'
      }, {
        label: '端口',
        name: 'port'
      }, {
        label: '密码',
        name: 'auth',
        type: 'password',
        helperText: '连接redis所需的密码，如无则留空'
      }].map((item, i) => {
        return (
          <TextField
            key={i}
            className={classes.margin}
            label={item.label}
            type={item.type || 'text'}
            helperText={item.helperText || ''}
            value={nowEdit[item.name]}
            onChange={e => this.editorInput(e, item.name)}
            fullWidth
            margin='normal'
          />
        )
      })}
      <Grid container alignItems='flex-start'>
        <Grid item xs={12} sm={8}>
          <Button variant='contained' size='large' color='primary' className={classes.margin}>测试</Button>
          <Button variant='contained' size='large' color='primary' className={classes.margin} onClick={() => this.connectionUpdate()}>确定</Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Grid container justify='flex-end'>
            <Button variant='contained' size='large' color='secondary' className={classNames(classes.margin, this.state.delConfirm ? '' : classes.hide)} onClick={() => this.connectionDel()}>确定删除</Button>
            <Button variant='contained' size='large' color='primary' className={classNames(classes.margin, this.state.delConfirm ? '' : classes.hide)} onClick={() => this.closeFloatThings()}>不删</Button>
            <Button variant='contained' size='large' color='secondary' className={classNames(classes.margin, this.state.delConfirm ? classes.hide : '')} onClick={() => this.openDelComfirm()}>删除</Button>
          </Grid>
        </Grid>
      </Grid>
    </div>)
  }

  /**
   * 编辑面板处
   * */
  editorInput (e, key) {
    this.state.connections[this.state.nowEditIndex][key] = e.target.value
    this.setState({ connections: this.state.connections })
  }
  // 更新连接配置
  connectionUpdate () {
    const nowEdit = this.state.connections[this.state.nowEditIndex]
    if (connModel.update(nowEdit.id, nowEdit)) {
      this.showTip('保存成功')
    }
  }
  connectionDel () {
    const nowEdit = this.state.connections[this.state.nowEditIndex]
    if (connModel.del(nowEdit.id)) {
      this.setState({
        connections: connModel.get(),
        selectedID: 0,
        nowEditIndex: -1,
        delConfirm: false
      })
      this.showTip('删除成功')
    }
  }

  /**
   * @param msg
   * @param type string success|warning|error|info
   * */
  showTip (msg, type) {
    this.setState({
      tipMessage: msg,
      tipType: type || 'info'
    })
  }

  render () {
    const { classes } = this.props

    return (
      <Theme>
        <div className={classes.root}>
          <AppBar position='absolute' className={classes.appBar}>
            <Toolbar>
              <Typography variant='h6' color='inherit' noWrap>
              连接配置
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            variant='permanent'
            classes={{
              paper: classes.drawerPaper
            }}
          >
            <div className={classes.toolbar} />
            <List>
              <ListItem button>
                <ListItemIcon>
                  <LibraryAddIco />
                </ListItemIcon>
                <ListItemText primary='新建' onClick={event => this.addNewConnect(event)} />
              </ListItem>
            </List>
            <Divider />
            <List>{this.connectionsJSX()}</List>
          </Drawer>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <div>{this.editorJSX()}</div>
          </main>
        </div>
        <Tip
          variant={this.state.tipType}
          message={this.state.tipMessage}
        />
      </Theme>
    )
  }
}

Connections.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

// 样式
const styles = (theme) => ({
  root: {
    flexGrow: 1,
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0, // So the Typography noWrap works
    overflow: 'auto'
  },
  toolbar: theme.mixins.toolbar,

  // 编辑面板处
  margin: {
    margin: theme.spacing.unit
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },

  hide: {
    display: 'none'
  }
})

export default withStyles(styles, {
  withTheme: true
})(Connections)
