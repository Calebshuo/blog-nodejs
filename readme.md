##  分别基于原生node.js/express框架开发博客系统。其中blog1为nodejs原生开发，blog-express为框架开发，html-test为静态资源文件，express-middle-demo为手动实现express中间件机制文件。

### 原生nodejs：
#### 基于userid、cookie、session、redis的登录验证方案。
#### nodejs 读文件相对路径问题，使用绝对路径原因，path.join/path.resolve用法。基于stream的好处。
#### 基于stream写入日志，基于linux crontab命令按日期拆分日志，基于nodejs的readline分析日志。
#### sql注入攻击、xss攻击、密码加密

### express框架：
#### 对比原生 cookieParser原理、bodyParser原理、日志写入原理、路由注册原理
#### 基于morgan库 区分生产环境和开发环境导出 详细/简洁 日志 到文件/控制台
#### 手动实现express中间件机制，详情见express-middle-demo文件。

### koa2框架开发中~~~
