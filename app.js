const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const log4js = require('./utils/log4j')
const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const koajwt = require('koa-jwt')
const util = require('./utils/util')
const users = require('./routes/users')
const menus = require('./routes/menus')
const roles = require('./routes/roles')
const depts = require('./routes/depts')

// error handler
onerror(app)
require('./config/db')
// app.on('error', err => {
//   log.error('server error', err)
//   // log4js.info(`server error:`,err)

// });




// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
// app.use(require('koa-static')(__dirname + '/public'))
app.use(require('koa-static')('./public/dist'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  // const start = new Date()
  log4js.info(`get params:${JSON.stringify(ctx.request.query)}`)
  log4js.info(`post params:${JSON.stringify(ctx.request.body)}`)
  // next();
  await next().catch((err) => {
    if (err.status == '401') {
      // ctx.status = 200;
      ctx.body = util.fail('Token认证失败', util.CODE.AUTH_ERROR)
    } else {
      throw err;
    }
  })
  // log4js.debug(`log output`)
  // const ms = new Date() - start
  // console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})


app.use(koajwt({ secret: "imooc" }).unless({
  path: [/^\/api\/users\/login/, '/users/login']
}))
router.prefix('/api');

router.use(users.routes(), users.allowedMethods())
router.use(menus.routes(), menus.allowedMethods())
router.use(roles.routes(), roles.allowedMethods())
router.use(depts.routes(), depts.allowedMethods())


app.use(router.routes(), router.allowedMethods())




// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)

});

app.listen(3000, '0.0.0.0', () => {
  console.log("koa路由服务器启动成功~");
});


module.exports = app
