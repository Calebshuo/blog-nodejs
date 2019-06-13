const { exec } = require('../db/mysql')

const getList = (author, keyword) => {
    // 其中 1=1 是占位用的，如果不写where，select * from blogs后面直接加and会报错，where后面什么也没有也会报错。类似于 aaa.html?a=1&b=2中的？。
    let sql = `select * from blogs where 1=1 `
    if (author) {
        sql += `and author='${author}'`
    }
    if (keyword) {
        sql += `and title like '${keyword}'`
    }
    sql += 'order by createtime desc'
    return exec(sql)
}

const getDetail = (id) => {
    const sql = `select * from blogs where id='${id}'`
    return exec(sql).then(rows => {
        return rows[0]
    })
}

const newBlog = (blogData = {}) => {
    // blogData 是一个博客对象，包含 title content author 属性
    const title = blogData.title
    const content = blogData.content
    const author = blogData.author
    const createtime = Date.now()

    const sql = `
        insert into blogs (title, content, createtime, author)
        values ('${title}', '${content}', ${createtime}, '${author}');
    `

    return exec(sql).then(insertData => {
        console.log('insertData is ', insertData)
        return {
            id: insertData.insertId
        }
    })
}

const upDateBlog = (id, blogData = {}) => {
    const title = blogData.title
    const content = blogData.content

    const sql = `
        update blogs set title='${title}', content='${content}' where id=${id}
    `

    return exec(sql).then(updateData => {
        console.log('updateData is ', updateData)
        if (updateData.affectedRows > 0) {
            return true
        }
        return false
    })
}

const delBlog = (id, author) => {
    const sql = `delete from blogs where id='${id}' and author='${author}';`
    return exec(sql).then(delData => {
        console.log('delData is ', delData)
        if (delData.affectedRows > 0) {
            return true
        }
        return false
    })
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    upDateBlog,
    delBlog
}