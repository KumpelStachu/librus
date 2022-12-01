import { router } from '../trpc'
import { authRouter } from './auth'
import { cookieRouter } from './cookie'
import { librusRouter } from './librus'

export const appRouter = router({
	auth: authRouter,
	cookie: cookieRouter,
	librus: librusRouter,
})

export type AppRouter = typeof appRouter
