const fs = require('fs')
const path = require('path')

const fileName = path.resolve(__dirname, '../data.txt')
console.log(process.cwd())
// 读取文件内容
var text = fs.readFileSync(fileName, 'utf8')
console.log(text)
console.log(path.resolve('../1'))

fs.readFile(fileName, (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    // data 是二进制类型，需要转换为字符串
    console.log(data.toString()) // 存在的问题：如果data这个变量过大则会让进程崩溃。
})

// 写入文件
const content = '这是新写入的内容\n'
const opt = {
    flag: 'a'  // 追加写入。覆盖用 'w'
}
fs.writeFile(fileName, content, opt, (err) => {
    if (err) {
        console.error(err)
    }
})

// // 判断文件是否存在
fs.exists(fileName, (exist) => {
    console.log('exist', exist)
})
