import { initTRPC, TRPCError } from '@trpc/server'
import type { Context } from './context'
import superjson from 'superjson'
import Librus from './librus'

const t = initTRPC.context<Context>().create({
	transformer: superjson,
	errorFormatter({ shape }) {
		return shape
	},
})

export const router = t.router

const isAuthed = t.middleware(async ({ ctx, next }) => {
	if (!ctx.session?.user || !ctx.token?.librus_token) {
		throw new TRPCError({ code: 'UNAUTHORIZED' })
	}

	const librus = await Librus(ctx.token.librus_token)
	if (!librus) {
		throw new TRPCError({ code: 'UNAUTHORIZED' })
	}

	return next({
		ctx: {
			session: ctx.session,
			librus,
		},
	})
})

export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(isAuthed)
