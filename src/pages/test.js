import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import LibraryBooksIco from '@material-ui/icons/LibraryBooks'
import Fade from '@material-ui/core/Fade'
import LinearProgress from '@material-ui/core/LinearProgress'
import Theme from './comm/Theme'
import SearchIcon from '@material-ui/icons/Search'
import Input from '@material-ui/core/Input'
import { fade } from '@material-ui/core/styles/colorManipulator'
import Badge from '@material-ui/core/Badge'
import MailIcon from '@material-ui/icons/Mail'
import NotificationsIcon from '@material-ui/icons/Notifications'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MoreIcon from '@material-ui/icons/MoreVert'
import Paper from '@material-ui/core/Paper'

// 表格
import MainTable from './comm/MainTable'

// 筛选
import Filter from './comm/Filter'

// 逻辑
const connModel = require('../models/connections')
// const redisModel = require('../models/redis')

const drawerWidth = 240

const styles = theme => ({
  root: {
    display: 'flex',
    height: '100%'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  hide: {
    display: 'none'
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9
    }
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0, // So the Typography noWrap works
    overflow: 'auto'
  },
  disableIndex: {
    margin: `0 ${theme.spacing.unit * 2}px 0 0`,
    width: 24,
    height: 24
  },
  orangeIndex: {
    margin: 0,
    color: '#fff',
    backgroundColor: '#ff5722'
  },
  loading: {
    marginTop: -5,
    height: 5,
    position: 'relative',
    overflow: 'hidden'
  },
  colorPrimary: {
    backgroundColor: '#00897B'
  },
  barColorPrimary: {
    backgroundColor: '#00695C'
  },

  // 搜索
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto'
    }
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit',
    width: '100%'
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200
    }
  },

  grow: {
    flexGrow: 1
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex'
    }
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },

  filterRoot: {
    padding: 24
  }
})

class HomePage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      leftBarOpen: false,
      open2: false,

      connections: connModel.get(), // 所有连接
      connectionSelected: false, // 正在选择的数据库
      connectionDBnum: [], // 所有连接的数据库数量
      connectionOpen: [], // 控制是否展开该连接的所有数据库

      nowLoading: false,
      nowDatas: [
        ['key:daa', 'string', ''],
        ['key:1', 'string', ''],
        ['key:2', 'string', ''],
        ['key:3', 'string', ''],
        ['key:4', 'string', ''],
        ['key:5', 'string', '']
      ] // 当前显示的库内的数据
    }

    // 缓存数据库的数据，切换数据库再切回来，就先显示缓存里的数据，然后同时再去查一遍数据库
    this.dbCache = {}

    // 表头
    this.tableHead = [
      {
        id: 'name', // 此列的唯一id，会设为key，react的数组DOM都必须要
        numeric: false, // 此列的数据是否为数字，如果是数字，此列内容会右对齐
        disablePadding: true, // 取消左右padding，默认会根据整个父级的padding来设置
        label: 'key', // 此单元格的文字内容
        isLineHead: true // 此列除表头外的数据是每行的表头
      },
      { id: 'type', numeric: false, disablePadding: false, label: 'type' },
      { id: 'value', numeric: false, disablePadding: false, label: 'type' }
    ]
  }

  loading () {
    this.setState({
      nowLoading: true
    })
  }

  toggleDrawer () {
    this.setState({ leftBarOpen: !this.state.leftBarOpen })
  }

  // 打开指定redis的指定数据库
  async openConnection (index, db) {
    // 每次切换数据库都改一下配置
    // const redisConf = this.state.connections[index]
    // redisModel.setRedis(redisConf.host, redisConf.port, redisConf.auth, db)

    // 如果有缓存数据， 先把它们展示出来，然后再异步获取新数据
    if (this.dbCache[`${index}:${db}`]) {
      this.setState({
        nowDatas: this.dbCache[`${index}:${db}`]
      })
    }
    this.setState({
      connectionSelected: [index, db]
    })
    this.loading()
    // const keys = await redisModel.getKeys()
    // const nowDatas = []
    // keys.some((item) => {
    //   nowDatas.push({
    //     key: item,
    //     type: false,
    //     value: false
    //   })
    // })
    // this.dbCache[`${index}:${db}`] = nowDatas
    // this.setState({
    //   nowDatas: nowDatas
    // })
  }

  // 展开某redis
  selectConnect (id, i) {
    this.state.connectionOpen[i] = !this.state.connectionOpen[i]
    this.state.connectionDBnum[i] = 5
    this.setState({
      connectionDBnum: this.state.connectionDBnum, // 该redis里有多少个库
      connectionOpen: this.state.connectionOpen // 展开连接列表
    })
  }

  /**
   * 构建连接s列表的jsx
   * */
  connectionsListJSX (classes) {
    const { state } = this
    const jsxs = []
    state.connections.some((item, i) => {
      jsxs.push((
        <ListItem
          button
          onClick={() => this.selectConnect(item.id, i)}
          key={item.id}>
          <ListItemIcon>
            <LibraryBooksIco />
          </ListItemIcon>
          <ListItemText inset primary={item.name} />
          {state.connectionOpen[i] ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
      ), (
        <Collapse in={state.connectionOpen[i]} timeout='auto' unmountOnExit
          key={'child_' + item.id}>
          <List component='div' disablePadding>
            {(() => {
              if (state.connectionDBnum[i]) {
                const arr = []
                for (let n = 0; n < state.connectionDBnum[i]; n++) {
                  arr.push(
                    <ListItem
                      button
                      selected={state.connectionSelected && state.connectionSelected[0] === i && state.connectionSelected[1] === n}
                      className={classes.nested}
                      key={`db_${n}_of_${item.id}`}
                      onClick={() => { this.openConnection(i, n) }}>
                      <Avatar className={classes.disableIndex}>{n + 1}</Avatar>
                      <ListItemText inset primary={`db:${n + 1}`} />
                    </ListItem>
                  )
                }
                return arr
              }
              return ''
            })()}
          </List>
        </Collapse>
      ))
    })
    return jsxs
  }

  render () {
    const { classes, theme } = this.props
    const { state } = this
    const isMenuOpen = true

    return (
      <Theme>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar
            position='fixed'
            className={classNames(classes.appBar, {
              [classes.appBarShift]: state.leftBarOpen
            })}
          >
            <Toolbar disableGutters={!state.leftBarOpen}>
              <IconButton
                color='inherit'
                aria-label='Open drawer'
                onClick={() => this.toggleDrawer()}
                className={classNames(classes.menuButton, {
                  [classes.hide]: state.leftBarOpen
                })}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant='h6' color='inherit' noWrap>
                {state.connectionSelected
                  ? (`${state.connections[state.connectionSelected[0]].name}:db:${state.connectionSelected[1] + 1}`)
                  : '未选择库'}
              </Typography>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <Input
                  placeholder='Search…'
                  disableUnderline
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput
                  }}
                />
              </div>
              <div className={classes.grow} />
              <div className={classes.sectionDesktop}>
                <IconButton color='inherit'>
                  <Badge className={classes.margin} badgeContent={4} color='secondary'>
                    <MailIcon />
                  </Badge>
                </IconButton>
                <IconButton color='inherit'>
                  <Badge className={classes.margin} badgeContent={17} color='secondary'>
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  aria-owns={isMenuOpen ? 'material-appbar' : null}
                  aria-haspopup='true'
                  onClick={() => this.handleProfileMenuOpen()}
                  color='inherit'
                >
                  <AccountCircle />
                </IconButton>
              </div>
              <div className={classes.sectionMobile}>
                <IconButton aria-haspopup='true' onClick={() => this.handleMobileMenuOpen()} color='inherit'>
                  <MoreIcon />
                </IconButton>
              </div>
            </Toolbar>
            <Fade
              in={state.nowLoading}
              style={{
                transitionDelay: state.nowLoading ? '800ms' : '0ms'
              }}
              unmountOnExit
            >
              <LinearProgress
                classes={{
                  colorPrimary: classes.colorPrimary,
                  barColorPrimary: classes.barColorPrimary,
                  root: classes.loading
                }}
              />
            </Fade>
          </AppBar>
          <Drawer
            variant='permanent'
            classes={{
              paper: classNames(classes.drawerPaper, !state.leftBarOpen && classes.drawerPaperClose)
            }}
            open={state.leftBarOpen}
          >
            <div className={classes.toolbar}>
              <IconButton onClick={() => this.toggleDrawer()}>
                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </div>
            <Divider />
            <List>
              {this.connectionsListJSX(classes)}
            </List>
          </Drawer>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Paper className={classes.filterRoot}>
              <Filter />
            </Paper>
            <MainTable
              head={this.tableHead}
              body={this.state.nowDatas}
            />
            {/* <Typography paragraph>请选择数据库</Typography> */}
          </main>
        </div>
      </Theme>
    )
  }
}

HomePage.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(HomePage)
