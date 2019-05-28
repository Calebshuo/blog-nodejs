const handleUserRouter = (req, res) => {
    const method = req.method

    // login
    if (method === 'POST' && req.path === '/api/blog/login') {
        return {
            msg: '这是登录的接口'
        }
    }
}

module.exports = handleUserRouter
