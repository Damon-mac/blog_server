import {exec} from '../database/mysql'
import xss from 'xss'
// 获取博客列表
export const getList = async (author, keyword) => {
  let sql = `select * from blogs where 1=1 `
  if (author) {
    sql += `and author='${author}' `
  }
  if (keyword) {
    sql += `and title like '%${keyword}%'`
  }
  sql += `order by createtime desc;`

  return await exec(sql)  // 这里返回的是promise
}
// 获取某一篇博客详情
export const getDetail = async id => {
  let sql = `select * from blogs where id='${id}'`
  const data = await exec(sql)
  return data[0]
}
// 新增博客
export const newBlog = async (blogData = {}) => {
  // const { title, content, author } = blogData
  // 防止xss攻击
  const title = xss(blogData.title)
  const content = xss(blogData.content)
  const author = xss(blogData.author)
  const createTime = Date.now()
  const sql = `
    insert into blogs (title, content, createTime, author)
    values ('${title}', '${content}', ${createTime}, '${author}')
  `
  const insertData = await exec(sql)
  return {
    id: insertData.insertId
  }
}
// 更新博客
export const updateBlog = async (id, blogData ={}) => {
  // const {title, content} = blogData
  const title = xss(blogData.title)
  const content = xss(blogData.content)
  let sql = `
    update blogs set title='${title}', content='${content}' where id=${id}
  `
  const updateData = await exec(sql)
  return updateData.affectedRows > 0
}
// 删除博客
export const delBlog = async (id, author) => {
  let sql = `delete from blogs where id=${id} and author='${author}';`
  const delData = await exec(sql)
  return delData.affectedRows > 0
}