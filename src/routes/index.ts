import { Application, Request, Response } from 'express'
import { Middleware } from '../middlewares'

interface UseRoutes {
  (app: Application, pathPrefix?: string): void
}

const placeholderRoute: Middleware = (
  _req: Request,
  res: Response
): void | Response => {
  return res.status(200).json({ message: 'All okay' })
}

const useRoutes: UseRoutes = (
  app: Application,
  pathPrefix = ''
): void => {
  app.use(`${pathPrefix}/`, placeholderRoute)
}

export default useRoutes
