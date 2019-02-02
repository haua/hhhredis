// 负责操作redis

const maxNumPerTime = 100 // 每次查询最多查询多少个key
let redisConfig = {}

module.exports = {
  async getKeys (limit) {
    if (!limit || limit > maxNumPerTime || typeof limit !== 'number') {
      limit = maxNumPerTime
    }
    const keys = []
    for (let i = 0; i < limit; i++) {
      keys.push(`key:${i + 1}`)
    }
    return keys
  },

  setRedis (host, port, auth, db) {
    redisConfig = {
      host, port, auth, db
    }
  }
}
