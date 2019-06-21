import { Controller, Get, Post, Auth } from '../decorator/router'
import { getList, getDetail, newBlog, updateBlog, delBlog } from '../controller/blog'
import { SuccessModel, ErrorModel } from '../model/resModel'
import { get } from '../database/redis'

@Controller('/api/blog')
export default class BlogRouter {
  @Get('list')
  @Auth
  async getBlogList(ctx, next) {
    const author = ctx.query.author
    const keyword = ctx.query.keyword
    const listData = await getList(author, keyword)
    ctx.body = new SuccessModel(listData)
  }

  @Get('detail')
  async getBlogDetail(ctx, next) {
    const id = ctx.query.id
    const data = await getDetail(id)
    ctx.body = new SuccessModel(data)
  }

  @Post('new')
  @Auth
  async addNewBlog(ctx, next) {
    const body = ctx.request.body
    const user = await get(ctx.session.userId)
    body.author = user.username
    const data = await newBlog(body)
    ctx.body = new SuccessModel('data')
  }

  @Post('update')
  @Auth
  async updateOldBlog(ctx, next) {
    const id = ctx.query.id
    const body = ctx.request.body
    const data = await updateBlog(id, body)
    ctx.body = data ? new SuccessModel('更新成功') : new ErrorModel('更新博客失败')
  }

  @Post('delete')
  @Auth
  async deleteBlog(ctx, next) {
    const id = ctx.query.id
    const user = await get(ctx.session.userId)
    const author = user.username
    const data = await delBlog(id, author)
    ctx.body = data ? new SuccessModel('删除成功') : new ErrorModel('删除博客失败')
  }
}