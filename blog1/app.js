const queryString = require('queryString')
const handleUserRouter = require('./src/router/user')
const handleBlogRouter = require('./src/router/blog')
const { get, set } = require('./src/db/redis')

// set cookie expire
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    console.log('d.toGMTString() is ', d.toGMTString())
    return d.toGMTString()
}

// the obj of storage
// const SESSION_DATA = {}

const getPostData = (req) => {
    return new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }
        let postData = ''
        req.on('data', chunk => {
          // console.log('before',chunk)
          postData += chunk.toString()
          // console.log('after',chunk.toString)
        })
        req.on('end', () => {
          if (!postData) {
              resolve({})
              return
          }
          console.log('postData', postData,'JSON.parse(postData)',JSON.parse(postData))
          resolve(JSON.parse(postData))
        })
    })
}

const serverHandle = (req, res) => {
    // response header
    res.setHeader('Content-type', 'application/json')

    // get path
    const url = req.url
    req.path = url.split('?')[0]

    // parse query
    req.query = queryString.parse(url.split('?')[1])
    console.log('req.query', req.query)
    // parse cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    console.log('cookieStr', cookieStr)
    cookieStr.split(';').forEach(element => {
        if (element.indexOf('=') !== -1) {
            const arr = element.split('=')
            const key = arr[0].trim()
            const val = arr[1].trim()
            req.cookie[key] = val
        }
    }); 
    console.log('req.cookie:',req.cookie)
    // parse session
    // let needSetCookie = false
    // let userId = req.cookie.userid
    // if (userId) {
    //     if (!SESSION_DATA[userId]) {
    //         SESSION_DATA[userId] = {}
    //     }
    // } else {
    //     needSetCookie = true
    //     userId = `${Date.now()}_${Math.random()}`
    //     SESSION_DATA[userId] = {}
    // }
    // req.session = SESSION_DATA[userId]

    // parse session （by redis）
    let needSetCookie = false
    let userId = req.cookie.userid
    if (!userId) {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        // init redis session
        set(userId, {})
    }
    // get session
    req.sessionId = userId
    get(req.sessionId).then(sessionData => {
        if (sessionData == null) {
            // init redis session
            set(req.sessionId, {})
            // set session
            req.session = {}
        } else {
            // set session
            req.session = sessionData
        }
        // console.log('req.session ', req.session)

        // resolve post data
        return getPostData(req)
    })
    // resolve post method
    .then(postData => {
        // 给req.body赋值
        req.body = postData
        // resolve blog router
        const blogData = handleBlogRouter(req, res)
        if (blogData) {
            if (needSetCookie) {
                res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
            }
            blogData.then(v => {
                res.end(
                    JSON.stringify(v)
                )
            })
            return
        }
        // resolve user router
        const userData = handleUserRouter(req, res)
        if (userData) {
            if (needSetCookie) {
                res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
            }
            userData.then(v => {
                res.end(
                    JSON.stringify(v)
                )
            })
            return
        }
        // not match above router，改写响应头
        res.writeHead(404, {'Content-type': 'text/plain'})
        res.write("404")
        res.end()
    })
}

module.exports = serverHandle