import redis from 'redis'
import config from '../config'
const {port, host} = config.redis

const redisClient = redis.createClient(port, host)

function set(key, value) {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  redisClient.set(key, value, redis.print)
}

function get(key) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if (err) {
        reject(err)
        return
      }
      if (val == null) {
        resolve(null)
        return
      }
      try {
        resolve(JSON.parse(val))
      } catch(ex) {
        resolve(val)
      }
    })
  })
}

export {
  set,
  get
}