const BASE_URL = 'https://api.librus.pl'

async function getToken(credentials: Librus.OAuth.Credentials) {
	const res = await fetch(`${BASE_URL}/OAuth/Token`, {
		method: 'POST',
		body: new URLSearchParams({
			librus_long_term_token: '1',
			grant_type: 'password',
			...credentials,
		}),
		headers: {
			Authorization: 'Basic Mjg6ODRmZGQzYTg3YjAzZDNlYTZmZmU3NzdiNThiMzMyYjE=',
		},
	})

	if (!res.ok) throw new Error('auth failed')

	return res.json()
}

export default async function Librus(credentials: Librus.OAuth.Token | Librus.OAuth.Credentials) {
	const token: Librus.OAuth.Token =
		'access_token' in credentials ? credentials : await getToken(credentials)
	if (!token) throw new Error('token is required')

	async function api<K extends string, T>(endpoint: string) {
		const res: Librus.API.Response<K, T> | null = await fetch(`${BASE_URL}/2.0${endpoint}`, {
			headers: { Authorization: `Bearer ${token.access_token}` },
		}).then(r => r.ok && r.json())

		// console.log(endpoint, res)

		// @ts-expect-error error if not ok
		if (!res) throw new Error(res.Message)

		return res
	}

	return {
		token,
		api,
	}
}
