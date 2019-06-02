const getList = (author, keyword) => {
    // mock data
    return [
        {
            id: 2,
            title: '标题B',
            content: '内容B',
            createTime: 987654321,
            author: 'LLL'
        }
    ]
}

const getDetail = (id) => {
    return [
        {
            id: 1,
            title: '标题A',
            content: '内容A',
            createTime: 123456789,
            author: 'caleb'
        }
    ]
}

const newBlog = (blogData = {}) => {
    return {
        id: 1
    }
}

const upDateBlog = (id, blogData = {}) => {
    return true
}

module.exports = {
    getList,
    getDetail,
    newBlog
}