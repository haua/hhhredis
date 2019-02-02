// 管理连接配置，暂时未决定存在localstoge还是文件

const LocalStorage = require('localstorage')
const localstorage = new LocalStorage('h')
module.exports = {

  // 创建一个连接配置
  create () {
    const allConnections = this.get()
    let maxID = 0
    allConnections.some((item) => {
      if (item.id > maxID) {
        maxID = item.id
      }
    })
    const data = {
      id: maxID + 1,
      name: '新连接',
      host: '',
      port: '',
      auth: ''
    }
    allConnections.push(data)
    localstorage.put('allConnections', allConnections)
    return data
  },

  get () {
    return localstorage.get('allConnections')[1] || []
  },

  update (id, datas) {
    const allConnections = this.get()
    datas.id = id
    let updateNum = 0

    localstorage.put('allConnections', allConnections.map((item) => {
      if (item.id === id) {
        updateNum++
        item = datas
        return item
      }
      return item
    }))
    return updateNum > 0
  },

  del (id) {
    const allConnections = this.get()
    const newConnections = []
    let updateNum = 0
    for (let i = 0; i < allConnections.length; i++) {
      if (allConnections[i].id === id) {
        updateNum++
        continue
      }
      newConnections.push(allConnections[i])
    }
    localstorage.put('allConnections', newConnections)
    return updateNum > 0
  }
}
