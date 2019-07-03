const http = require('http')
const slice = Array.prototype.slice

class LikeExpress {
    constructor() {
        // 存放中间件的列表
        this.routes = {
            all: [],   // app.use(...)
            get: [],   // app.get(...)
            post: []   // app.post(...)
        }
    }

    register(path) {
        const info = {}
        if (typeof path === 'string') {
            info.path = path
            // 从第二个参数开始，转换为数组，存入 stack
            info.stack = slice.call(arguments, 1)
        } else {
            info.path = '/' // 中间件没有第一个参数和第一个参数是'/'是一样的，因为所有路径都会命中这个中间件
            // 从第一个参数开始，转换为数组，存入 stack，就是把所有中间件存入stack这个数组
            info.stack = slice.call(arguments, 0)
        }
        return info
    }

    use() {
        const info = this.register.apply(this, arguments) // 注意下写法，结合手写apply来理解这段代码。
        this.routes.all.push(info)
    }

    get() {
        const info = this.register.apply(this, arguments)
        this.routes.get.push(info)
    }

    post() {
        const info = this.register.apply(this, arguments)
        this.routes.post.push(info)
    }

    match(method, url) {
        let stack = []
        if (url === '/favicon.ico') {
            return stack
        }

        // 先通过method进行过滤
        let curRoutes = []
        curRoutes = curRoutes.concat(this.routes.all)
        curRoutes = curRoutes.concat(this.routes[method])

        // 再通过url进行过滤
        curRoutes.forEach(routeInfo => {
            if (url.indexOf(routeInfo.path) === 0) {
                // url === '/api/get-cookie' 且 routeInfo.path === '/'
                // url === '/api/get-cookie' 且 routeInfo.path === '/api'
                // url === '/api/get-cookie' 且 routeInfo.path === '/api/get-cookie'
                stack = stack.concat(routeInfo.stack)
            }
        })
        return stack
    }

    // 核心的 next 机制
    handle(req, res, stack) {
        const next = () => {
            // 出队拿到第一个匹配的中间件，直到队列为空
            const middleware = stack.shift()
            if (middleware) {
                // 执行中间件函数
                middleware(req, res, next)
            }
        }
        next()
    }

    callback() {
      // 返回的函数格式要符合http.createServer接收函数的写法。
        return (req, res) => {
          // 原生没有res.json这个方法所以需要自己实现以下。
            res.json = (data) => {
                res.setHeader('Content-type', 'application/json')
                res.end(
                    JSON.stringify(data)
                )
            }
            const url = req.url
            const method = req.method.toLowerCase()

            const resultList = this.match(method, url) // 获取method和url都符合的中间件列表
            this.handle(req, res, resultList)
        }
    }

    // app.listen
    listen(...args) {
        const server = http.createServer(this.callback())
        server.listen(...args) // 参数透传，基于原生nodejs，和原生一样的写法。
    }
}

// 工厂函数
module.exports = () => {
    return new LikeExpress()
}