const { login } = require('../controller/user')
const  { SuccessModel, ErrorModel } = require('../model/resModel')
const { set } = require('../db/redis')

const handleUserRouter = (req, res) => {
    const method = req.method

    // login
    if (method === 'POST' && req.path === '/api/user/login') {
        const { username, password } = req.body // 存疑 undefine外面没有引号
        console.log('username,password', username,password)
        const result = login(username, password)
        return result.then(data => {
            if (data.username) {
                // 设置 session
                req.session.username = data.username
                req.session.realname = data.realname
                set(req.sessionId, req.session)
                return new SuccessModel(req.session)
            } else {
                return new ErrorModel('login failed')
            } 
        })
    }
}

module.exports = handleUserRouter
