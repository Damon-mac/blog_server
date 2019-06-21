import Koa from 'koa'
import R from 'ramda'
import config from './config'
import path from 'path'

const MIDDLEWARES = ['general', 'router']

const useMiddlewares = app => {
  R.map(
    R.compose(
      R.forEachObjIndexed(
        e => e(app)
      ),
      require,
      name => path.join(__dirname, `./middlewares/${name}`)
    )
  )(MIDDLEWARES)
}

;(async() => {
  const app = new Koa()
  const { port } = config
  await useMiddlewares(app)
  app.listen(port, () => {
    console.log(
      process.env.NODE_ENV === 'development'
        ? `open http://localhost:${port}`
        : `app listening on port ${port}` 
    )
  })
})()