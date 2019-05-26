const http = require('http')
const querystring = require('querystring')

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    const method = req.method
    // console.log('method',method)
    const url = req.url
    // console.log('url',url)
    const query = querystring.parse(url.split('?')[1]) // query是一个Object。
    // console.log('query', query)
    // res.setHeader('Content-type', 'text/plain') // 设置返回头没看出有什么区别。
    res.end(JSON.stringify({
      method,
      url,
      query
    }))
  }
  if (req.method === 'POST') {
    console.log('req content-type', req.headers['content-type'])
    let postData = ''
    req.on('data', chunk => {
      // console.log('before',chunk)
      postData += chunk.toString()
      // console.log('after',chunk.toString)
    })
    req.on('end', () => {
      console.log('postData', postData)
      res.end(postData)
    })
  }
})

server.listen('8000', () => {
  console.log('node app start at port 9093')
})