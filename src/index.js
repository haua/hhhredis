// 这是视图的入口js文件，入口 html 文件在 ../public/index.html

import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

import Router from './router'

// import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Router />, document.getElementById('root'))
// registerServiceWorker();
