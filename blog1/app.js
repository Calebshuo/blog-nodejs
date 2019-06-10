const queryString = require('queryString')
const handleUserRouter = require('./src/router/user')
const handleBlogRouter = require('./src/router/blog')

const postData = (req) => {
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
          console.log('postData', postData)
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

    // resolve post method
    postData(req).then((postData) => {
        // 给req.body赋值
        req.body = postData
        // resolve blog router
        const blogData = handleBlogRouter(req, res)
        if (blogData) {
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
            res.end(
                JSON.stringify(userData)
            )
            return
        }
        // not match above router，改写响应头
        res.writeHead(404, {'Content-type': 'text/plain'})
        res.write("404")
        res.end()
    })
}

module.exports = serverHandle