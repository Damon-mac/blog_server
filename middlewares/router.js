import { Route } from '../decorator/router'
import path from 'path'

exports.router = app => {
  const routesPath = path.resolve(__dirname, '../routes')
  const instance = new Route(app,routesPath)
  instance.init()
}