const handleBlogRouter = (req, res) => {
    const method = req.method

    // get blog list
    if (method === 'GET' && req.path === '/api/blog/list') {
        return {
            msg: '这是获取博客列表的接口'
        }
    }

    // get blog detail
    if (method === 'GET' && req.path === '/api/blog/detail') {
        return {
            msg: '这是获取博客详情的接口'
        }
    }

    // create blog 
    if (method === 'POST' && req.path === '/api/blog/new') {
        return {
            msg: '这是新建博客的接口'
        }
    }
    // update blog 
    if (method === 'GET' && req.path === '/api/blog/update') {
        return {
            msg: '这是更新博客的接口'
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