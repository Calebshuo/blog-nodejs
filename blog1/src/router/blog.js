const { getList, 
        getDetail, 
        newBlog, 
        upDateBlog } = require('../controller/blog')
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
        const flag = upDateBlog(id)
        if (flag) {
            return new SuccessModel('update success')
        } else {
            return new ErrorModel('update failed')
        }
    }
    // delete blog
    if (method === 'POST' && req.path === '/api/blog/del') {
        return {
            msg: '这是删除博客的接口'
        }
    }
}

module.exports = handleBlogRouter   