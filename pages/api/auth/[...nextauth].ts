import NextAuth, { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import Librus from 'server/librus'

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			credentials: {
				username: {
					label: 'Login',
					placeholder: '7128906u',
					value: process.env.NODE_ENV === 'development' ? '7128906u' : '',
				},
				password: { label: 'Hasło', type: 'password' },
			},
			id: 'librus',
			name: 'Librus Synergia',
			async authorize(credentials) {
				if (!credentials?.username || !credentials.password) return null

				const librus = await Librus(credentials)
				if (!librus) return null

				const me = await librus.api<'Me', Librus.Me>('/Me')
				if (!me) return null
				const { Account } = me.Me

				return {
					id: credentials.username,
					librus_token: librus.token,
					...Account,
				}
			},
		}),
	],
	callbacks: {
		async session({ session, token }) {
			// console.log('[SESSION]', { session, token })
			session.user = token.user as User
			// session.token = token.librus_token as Librus.OAuth.Token
			return session
		},
		async jwt({ token, user }) {
			// console.log('[JWT]', { token, user })
			if (user) {
				const { librus_token, ..._user } = user
				token.librus_token = librus_token
				token.user = _user as User
			}
			return token
		},
	},
	jwt: {
		maxAge: 24 * 60 * 60,
	},
	session: {
		strategy: 'jwt',
		maxAge: 24 * 60 * 60,
	},
}

export default NextAuth(authOptions)
