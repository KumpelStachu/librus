declare global {
	namespace NodeJS {
		interface ProcessEnv {
			VERCEL?: '1'
			NEXTAUTH_URL: string
			NEXTAUTH_SECRET: string
		}
	}
}

export {}
