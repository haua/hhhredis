// 写好默认的样式，其它页面都来import这个文件

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import React from 'react'

const theme = createMuiTheme({
  // https://material-ui.com/style/typography/#migration-to-typography-v2
  // 这里说，必须要有下面这个属性，才能让它不把下一个版本的改动作为报错提出来。
  // 然而，这会导致 SnackbarContent 生成一个p标签内加div标签的报错，横竖都是报错，就不管了
  typography: {
    // useNextVariants: true
  },
  palette: {
    primary: {
      main: '#00897B'
    },
    secondary: {
      main: '#ea605d'
    }
  }
  // overrides: {
  //   MuiButton: { // Name of the component ⚛️ / style sheet
  //     root: { // Name of the rule
  //       background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  //       borderRadius: 3,
  //       border: 0,
  //       color: 'white',
  //       height: 48,
  //       padding: '0 30px',
  //       boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'
  //     }
  //   }
  // }
})
export default function Theme (props) {
  return (
    <MuiThemeProvider theme={theme} >{props.children}</MuiThemeProvider>
  )
}
