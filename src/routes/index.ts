import { Application } from 'express'
import userRoute from './user.route'

interface UseRoutes {
  (app: Application, pathPrefix?: string): void
}

const useRoutes: UseRoutes = (
  app: Application,
  pathPrefix = ''
): void => {
  app.use(`${pathPrefix}/users`, userRoute)
}

export default useRoutes
