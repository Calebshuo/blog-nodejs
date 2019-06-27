var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan') // 自动生成日志
const blogRouter = require('./router/blog')
const userRouter = require('./router/user')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

var app = express()
console.log(1111111111111)
// // view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

const ENV = process.env.NODE_ENV
if (ENV !== 'production') {
  // 开发环境 / 测试环境
  app.use(logger('dev'));
} else {
  // 线上环境
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(logger('combined', {
    stream: writeStream
  }));
}

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

const redisClient = require('./db/redis')
const sessionStore = new RedisStore({
  client: redisClient
})
// 密匙类似于md5加密的那个
app.use(session({
  secret: 'calebli',
  cookie: {
    // path: '/',  // default setting
    // httpOnly: true, // default setting
    maxAge: 24 * 60 *60 * 1000
  },
  store: sessionStore
}))

// 注册路由
app.use('/api/blog', blogRouter)
app.use('/api/user', userRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'dev' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
