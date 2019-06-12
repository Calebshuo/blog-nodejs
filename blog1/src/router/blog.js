const { getList, 
        getDetail, 
        newBlog, 
        upDateBlog,
        delBlog } = require('../controller/blog')
const  { SuccessModel, ErrorModel } = require('../model/resModel')
// check login
const loginCheck = (req) => {
    if (!req.session.username) {
        return Promise.resolve(
            new ErrorModel('not login')
        )
    }
}
const handleBlogRouter = (req, res) => {
    const method = req.method
    const id = req.query.id

    // get blog list
    if (method === 'GET' && req.path === '/api/blog/list') {
        let author = req.query.author || ''
        const keyword = req.query.keyword || ''
        // const listData = getList(author, keyword)
        // return new SuccessModel(listData)
        const result = getList(author, keyword)
        return result.then(listData => (new SuccessModel(listData))
        )
    }

    // get blog detail
    if (method === 'GET' && req.path === '/api/blog/detail') {
        const result = getDetail(id)
        return result.then(detail => (new SuccessModel(detail)))
    }

    // create blog 
    if (method === 'POST' && req.path === '/api/blog/new') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // not login
            return loginCheckResult
        }
        req.body.author = req.session.username
        const result = newBlog(req.body)
        return result.then(id => (new SuccessModel(id)))
    }
    // update blog 
    if (method === 'GET' && req.path === '/api/blog/update') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // not login
            return loginCheckResult
        }
        const result = upDateBlog(id, req.body)
        return result.then(v => {
            if (v) {
                return new SuccessModel('update success')
            } else {
                return new ErrorModel('update failed')
            }
        })
    }
    // delete blog
    if (method === 'POST' && req.path === '/api/blog/del') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // not login
            return loginCheckResult
        }
        author = req.session.username
        const result = delBlog(id, author)
        return result.then(v => {
            if (v) {
                return new SuccessModel('delete success')
            } else {
                return new ErrorModel('delete failed')
            }
        })
    }
}

module.exports = handleBlogRouter   