import { router, publicProcedure } from 'server/trpc'
import { getCookie, setCookie } from 'cookies-next'
import { z } from 'zod'

const THEME_KEY = 'color_scheme' as const

export const cookieRouter = router({
	getTheme: publicProcedure.query(({ ctx: { req, res } }) => {
		return getCookie(THEME_KEY, { req, res }) === 'light' ? 'light' : 'dark'
	}),
	setTheme: publicProcedure
		.input(z.enum(['light', 'dark']))
		.mutation(({ ctx: { req, res }, input }) => {
			setCookie(THEME_KEY, input, { req, res })
		}),
})
