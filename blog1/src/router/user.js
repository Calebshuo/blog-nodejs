const { loginCheck } = require('../controller/login')
const  { SuccessModel, ErrorModel } = require('../model/resModel')

const handleUserRouter = (req, res) => {
    const method = req.method

    // login
    if (method === 'POST' && req.path === '/api/blog/login') {
        const { username, password } = req.body
        const result = loginCheck(username, password)
        return result.then(data => {
            if (data.username) {
                return new SuccessModel('login success')
            } else {
                return new ErrorModel('login failed')
            } 
        })
    }
}

module.exports = handleUserRouter
