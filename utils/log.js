import fs from 'fs'
import path from 'path'

// 生成write stream
function createWriteStream(filename) {
  const fullFileName = path.join(__dirname, '../', 'logs', filename)
  const writeStream = fs.createWriteStream(fullFileName, {
    flags: 'a'  // a-新增, w-覆盖
  })
  return writeStream
}

// 创建写日志流
const accessWriteStream = createWriteStream('access.log')
const errorWriteStream = createWriteStream('error.log')
const eventWriteStream = createWriteStream('event.log')

// 写日志
function writeLog(writeStream, log) {
  writeStream.write(log+ '\n')
}
// 作为中间件输出
export function access() {
  return async function(ctx, next) {
    const log = `${ctx.method} -- ${ctx.url} -- ${ctx.headers['user-agent']} -- ${new Date().toDateString()}`
    writeLog(accessWriteStream, log)
    await next()
  }
}
export function error(log) {
  writeLog(errorWriteStream, log)
}
export function event(log) {
  writeLog(eventWriteStream, log)
}