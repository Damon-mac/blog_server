import bodyParser from 'koa-bodyparser'
import session from 'koa-session'
import logger from 'koa-logger'
import views from 'koa-views'
import onerror from 'koa-onerror'
import koaStatic from 'koa-static'
import {access} from '../utils/log'

export const addOnError = app => {
  onerror(app)
}

export const addBodyParser = app => {
  app.use(bodyParser())
}

export const addAccessLog = app => {
  app.use(access())
}

export const addLogger = app => {
  app.use(logger())
}

export const addStatic = app => {
  app.use(koaStatic(__dirname + '../public'))
}

export const addViews = app => {
  app.use(views(__dirname + '../views', {
    extension: 'pug'
  }))
}

export const addSession = app => {
  app.keys = ['blog']
  const CONFIG = {
    // 配置 cookie
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    },
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000, /** (number || 'session') maxAge in ms (default is 1 days) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
  }
  app.use(session(CONFIG, app))
}