import { createNextApiHandler } from '@trpc/server/adapters/next'
import { log } from 'next-axiom'
import { createContext } from 'server/context'
import { appRouter } from 'server/router/_app'

export default createNextApiHandler({
	router: appRouter,
	createContext,
	onError({ path, error, type }) {
		log.error('[TRPC Error]', {
			type,
			path,
			error,
			cause: error.cause,
		})
	},
})
