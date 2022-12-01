declare module 'next-auth' {
	interface Session {
		user: User
		// token: Librus.OAuth.Token
	}

	interface User extends Librus.Account {
		librus_token: Librus.OAuth.Token
	}
}

import { User } from 'next-auth'

declare module 'next-auth/jwt' {
	interface JWT {
		librus_token: Librus.OAuth.Token
		user: Exclude<User, 'librus_token'>
	}
}

export {}
