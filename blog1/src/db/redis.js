const redis = require('redis')
const { REDIS_CONF } = require('../conf/db.js')

// create client
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)
redisClient.on('error', err => {
    console.error(err)
})

function set(key, val) {
    if (typeof val === 'object') {
        val = JSON.stringify(val)  // redis的key，value必须是字符串，如果不是的话就会隐式转换成val.toString这种形式。
    }
    redisClient.set(key, val, redis.print)
}

function get(key) {
    const promise = new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            if (err) {
                reject(err)
                return
            }
            if (val == null) {
                resolve(null)
                return
            }

            try {
                resolve(
                    JSON.parse(val) // 兼容val是对象序列化后的情况。
                )
            } catch (ex) {
                resolve(val)
            }
        })
    })
    return promise
}

module.exports = {
    set,
    get
}