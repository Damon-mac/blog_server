import { exec, escape } from '../database/mysql'
import { genPassword } from '../utils/cryp.js'

export const loginCheck = async (username, password) => {
  username = escape(username)

  // 生成加密密码
  password = escape(genPassword(password))
  const sql = `
    select username, realname from users where username=${username} and password=${password}
  `
  const res = await exec(sql)
  return res[0] || {}
}