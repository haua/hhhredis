let devConfig = {
  environment: 'development',
}

let electron = {
  environment: 'production', // production development

  // 把环境设置为开发环境
  setDev(){
    for(let a in devConfig){
      electron[a] = devConfig[a]
    }
  }
}

module.exports = electron
