import mysql from 'mysql'
import config from '../config'
// 创建链接对象
const con = mysql.createConnection(config.mysql)
// 开始链接
con.connect()

// 统一执行sql的函数
function exec(sql) {
  return new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) {
        reject(err)
        return
      }
      resolve(result)
    })
  })
}
const escape = mysql.escape
export {
  exec,
  escape
}