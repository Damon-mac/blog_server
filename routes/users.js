import { Controller, Get, Post } from '../decorator/router'
import { loginCheck } from '../controller/users'
import { SuccessModel, ErrorModel } from '../model/resModel'
import { set } from '../database/redis'

@Controller('/api/user')
export default class UserRouter {
  @Post('login')
  async login(ctx, next) {
    const { username, password } = ctx.request.body
    // const { username, password } = ctx.query
    console.log(ctx.request.headers.cookie)
    const data = await loginCheck(username, password)
    if (data.username) {
      // 设置session
      const userId = `${Date.now()}_${Math.random()}`
      set(userId, data)
      ctx.session.userId = userId
      ctx.body = new SuccessModel(data)
      return
    }
    ctx.body = new ErrorModel('登录失败')
  }
}
