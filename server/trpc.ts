import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import type { Context } from './context'
import Librus from './librus'
import { log } from 'next-axiom'

const t = initTRPC.context<Context>().create({
	transformer: superjson,
	errorFormatter({ shape }) {
		return shape
	},
})

export const router = t.router

const isAuthed = t.middleware(async ({ ctx, next }) => {
	if (!ctx.session?.user || !ctx.token?.librus_token) {
		log.error('UNAUTHORIZED', {
			session: ctx.session,
			token: ctx.token,
		})
		throw new TRPCError({ code: 'UNAUTHORIZED' })
	}

	const librus = await Librus(ctx.token.librus_token)
	if (!librus) {
		throw new TRPCError({ code: 'PRECONDITION_FAILED', message: typeof librus })
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
