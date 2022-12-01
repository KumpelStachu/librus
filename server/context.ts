import type { inferAsyncReturnType } from '@trpc/server'
import type { CreateNextContextOptions } from '@trpc/server/adapters/next'
import { unstable_getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'
import { authOptions } from 'pages/api/auth/[...nextauth]'

export const createContext = async ({ req, res }: CreateNextContextOptions) => {
	const session = await unstable_getServerSession(req, res, authOptions)
	const token = await getToken({ req })

	return {
		req,
		res,
		session,
		token,
	}
}

export type Context = inferAsyncReturnType<typeof createContext>
