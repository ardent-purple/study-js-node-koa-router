const Koa = require('koa')
const Router = require('koa-router')

const app = new Koa()
const router = new Router()

router
	.use(ctx => { console.log('common use')})

router.get('/', async (ctx, next) => {
  // ctx.router is awailable
  ctx.body = 'hello, this is main'
})

router.get('/under', ctx => {
  ctx.body = 'hello, how are you, i\'m under the water, pls help me'
})

router.get('/multiple', 
async (ctx, next) => {
  await next()
  ctx.body = ctx.body.toLowerCase()
},
async ctx => {
  ctx.body = 'HELLO'
})

const nestedRouter = new Router() // вложенный роутер
nestedRouter // вешаем на него методы
.get('/', ctx => { // обратим внимание на пути -- они локальны относительно роутера, в который были добавлены
  ctx.body = 'hello from nested router index'
  console.log('nested')
})
.get('/crap/:id', ctx => {
  ctx.body = `You requested crap with id of ${ctx.params.id}`
})

// вешаем вложенный роутер
router.use('/nested', nestedRouter.routes(), nestedRouter.allowedMethods())

router
  .use([ '/logme', '/logme2' ], 
    ctx => {
    console.log(ctx.path + ' logged please')
  }, 
    ctx => { console.log(ctx.path + 'aaaaand logged as well') }
  )
  .get('/logme', ctx => {
    ctx.body = 'logme'
  })
  .get('/logme2', ctx => {
    ctx.body = 'logme2'
  })


const port = 1337
app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(port)