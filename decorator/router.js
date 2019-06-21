import KoaRouter from 'koa-router'
import glob from 'glob'
import R from 'ramda'
import path from 'path'
import { SuccessModel, ErrorModel } from '../model/resModel'

const pathPrefix = Symbol('pathPrefix')
const routeMap = []
const resolvePath = R.unless( // 统一路径格式以'/'开头
  R.startsWith('/'),  // R.unless用法, 符合第一个参数规则直接返回, 不符合执行第二个参数的方法
  R.curryN(2, R.concat)('/')
)
const changeToArr = R.unless( // 把不是数组格式的转换为数组
  R.is(Array),
  R.of  // 不管是不是数组, 外面都包一层数组
)

export class Route {
  constructor(app, routesPath) {
    this.app = app
    this.router = new KoaRouter()
    this.routesPath = routesPath
  }
  init() {
    const { app, router, routesPath } = this
    glob.sync(path.resolve(routesPath, './*.js')).forEach(require)
    R.forEach(
      ({ target, method, path, callback }) => {
        const prefix = resolvePath(target[pathPrefix])
        router[method](prefix + path, ...callback)
      }
    )(routeMap)

    app.use(router.routes())
    app.use(router.allowedMethods())
  }
}

export const Controller = path => target => target.prototype[pathPrefix] = path

const setRouter = method => path => (target, key, descriptor) => {
  routeMap.push({
    target,
    method,
    path: resolvePath(path),
    callback: changeToArr(target[key])
  })
  return descriptor
}

export const Get = setRouter('get')
export const Post = setRouter('post')
export const Delete = setRouter('delete')

const decorate = (args, middleware) => {
  let [target, key, descriptor] = args
  target[key] = changeToArr(target[key])
  target[key].unshift(middleware)
  return descriptor
}

const convert = middleware => (...args) => decorate(args, middleware)

// 判断cookie是否有登录信息, 检测登录是否失效
export const Auth = convert(async (ctx, next) => {
  console.log(ctx.session.userId)
  if (!ctx.session.userId) {
    return ctx.body = new ErrorModel('登陆信息已失效, 请重新登录')
  }
  await next()
})