const { getList, 
        getDetail, 
        newBlog, 
        upDateBlog,
        delBlog } = require('../controller/blog')
const  { SuccessModel, ErrorModel } = require('../model/resModel')

const handleBlogRouter = (req, res) => {
    const method = req.method
    const id = req.query.id

    // get blog list
    if (method === 'GET' && req.path === '/api/blog/list') {
        let author = req.query.author || ''
        const keyword = req.query.keyword || ''
        const listData = getList(author, keyword)
        return new SuccessModel(listData)
    }

    // get blog detail
    if (method === 'GET' && req.path === '/api/blog/detail') {
        const detail = getDetail(id)
        return new SuccessModel(detail)
    }

    // create blog 
    if (method === 'POST' && req.path === '/api/blog/new') {
        const data = newBlog(req.body)
        return new SuccessModel(data)
    }
    // update blog 
    if (method === 'GET' && req.path === '/api/blog/update') {
        const result = upDateBlog(id)
        if (result) {
            return new SuccessModel('update success')
        } else {
            return new ErrorModel('update failed')
        }
    }
    // delete blog
    if (method === 'POST' && req.path === '/api/blog/del') {
        const result = delBlog(id)
        if (result) {
            return new SuccessModel('delete success')
        } else {
            return new ErrorModel('delete failed')
        }
    }
}

module.exports = handleBlogRouter   