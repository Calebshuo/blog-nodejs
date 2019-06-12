const { login } = require('../controller/user')
const  { SuccessModel, ErrorModel } = require('../model/resModel')

const handleUserRouter = (req, res) => {
    const method = req.method

    // login
    if (method === 'POST' && req.path === '/api/user/login') {
        const { username=1, password=1 } = req.body // 存疑 undefine外面没有引号
        console.log('username,password', username,password)
        const result = login(username, password)
        return result.then(data => {
            if (data.username) {
                // 设置 session
                req.session.username = data.username
                req.session.realname = data.realname
                return new SuccessModel(req.session)
            } else {
                return new ErrorModel('login failed')
            } 
        })
    }
}

module.exports = handleUserRouter
