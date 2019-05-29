const http = require('http')
const queryString = require('queryString')
const handleUserRouter = require('./src/router/user')
const handleBlogRouter = require('./src/router/blog')

const serverHandle = (req, res) => {
    // response header
    res.setHeader('Content-type', 'application/json')

    // get path
    const url = req.url
    req.path = url.split('?')[0]

    // parse query
    const query = queryString.parse(url.split('?')[1])
    // resolve blog router
    const blogData = handleBlogRouter(req, res)
    if (blogData) {
        res.end(
            JSON.stringify(blogData)
        )
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

    // not match above router
    res.writeHead(404, {'Content-type': 'text/plain'})
    res.write("404")
    res.end()
}

const PORT = 8000

const server = http.createServer(serverHandle)

server.listen(PORT, () => {
    console.log('node app start at port 8000')
})
