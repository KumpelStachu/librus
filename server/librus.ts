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

	if (!res.ok) {
		throw new Error('auth failed')
	}

	return res.json()
}

export default async function Librus(credentials: Librus.OAuth.Token | Librus.OAuth.Credentials) {
	const token: Librus.OAuth.Token =
		'access_token' in credentials ? credentials : await getToken(credentials)
	if (!token) throw new Error('token is required')

	async function api<K extends string, T>(
		endpoint: string,
		body?: BodyInit,
		headers?: HeadersInit
	) {
		const res = await fetch(`${BASE_URL}/2.0${endpoint}`, {
			headers: { ...headers, Authorization: `Bearer ${token.access_token}` },
			method: body !== undefined ? 'POST' : 'GET',
			body,
		})

		if (!res.ok) {
			throw new Error(await res.text())
		}

		return res.json() as Promise<Librus.API.Response<K, T>>
	}

	return {
		token,
		api,

		me: () => api<'Me', Librus.Me>('/Me').then(r => r.Me),
		user: <Teacher extends boolean = true>(Id: number) =>
			api<'User', Librus.User<Teacher>>(`/Users/${Id}`).then(r => r.User),
		class: (UserId: number) => api<'Class', Librus.Class>(`/Classes/${UserId}`).then(r => r.Class),
		unit: (Id: number) => api<'Unit', Librus.Unit>(`/Units/${Id}`).then(r => r.Unit),
		school: () => api<'School', Librus.School>('/Schools').then(r => r.School),

		notifications: (UserId: number) =>
			api<'data', Librus.Notification[]>(`/NotificationCenterDeferrals/${UserId}`).then(
				r => r.data
			),
		files: () => api<'Data', Librus.SchoolFile[]>('/SchoolFiles').then(r => r.Data),

		assignments: () =>
			api<'HomeWorkAssignments', Librus.Homework[]>('/HomeWorkAssignments').then(
				r => r.HomeWorkAssignments
			),
		assignment: (Id: string) =>
			api<'HomeWorkAssignment', Librus.Homework>(`/HomeWorkAssignments/${Id}`).then(
				r => r.HomeWorkAssignment
			),
		assignmentMarkAsDone: (Id: number) =>
			api<'Status', string>('/HomeWorkAssignments/MarkAsDone', `{"homework":${Id}}`, {
				'Content-Type': 'application/x-www-form-urlencoded',
			}).then(r => r.Status),

		notices: () =>
			api<'SchoolNotices', Librus.Notice[]>('/SchoolNotices').then(r => r.SchoolNotices),
		notice: (Id: string) =>
			api<'SchoolNotice', Librus.Notice>(`/SchoolNotices/${Id}`).then(r => r.SchoolNotice),
		noticeMarkAsRead: (Id: string) => api(`/SchoolNotices/MarkAsRead/${Id}`, ''),
	}
}
