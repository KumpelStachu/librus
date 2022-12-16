import NextAuth, { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import Librus, { refreshToken } from 'server/librus'

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

				const { Account } = await librus.me()
				if (!Account) return null

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
			session.user = token.user as User
			return session
		},
		async jwt({ token, user }) {
			if (user) {
				const { librus_token, ..._user } = user

				token.librus_token ??= librus_token
				token.user = _user as User

				if (
					token.librus_token.issued_at + token.librus_token.expires_in >=
					Math.ceil(new Date().getTime() / 1000)
				)
					token.librus_token = await refreshToken(token.librus_token)
			}

			return token
		},
	},
}

export default NextAuth(authOptions)
