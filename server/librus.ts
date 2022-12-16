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

	return {
		...(await res.json()),
		issued_at: Math.floor(new Date().getTime() / 1000),
	}
}

export async function refreshToken(token: Librus.OAuth.Token) {
	// TODO: handle refreshing token
	return token
}

export default async function Librus(credentials: Librus.OAuth.Token | Librus.OAuth.Credentials) {
	const token: Librus.OAuth.Token =
		'access_token' in credentials ? credentials : await getToken(credentials)
	if (!token) throw new Error('token is required')

	async function api<T>(endpoint: string, key: string, body?: BodyInit, headers?: HeadersInit) {
		const res = await fetch(`${BASE_URL}/2.0${endpoint}`, {
			headers: { ...headers, Authorization: `Bearer ${token.access_token}` },
			method: body !== undefined ? 'POST' : 'GET',
			body,
		})

		if (!res.ok) {
			throw new Error(await res.text())
		}

		return (res.json() as Promise<Librus.API.Response<typeof key, T>>).then(r => r[key])
	}

	const str = <T>(a: T[]) => (a.length === 1 ? [...a, ...a] : a).join(',')

	return {
		token,
		api,

		files: () => api<Librus.SchoolFile[]>('/SchoolFiles', 'Data'),
		notifications: (UserId: number) =>
			api<Librus.Notification[]>(`/NotificationCenterDeferrals/${UserId}`, 'data'),

		me: () => api<Librus.Me>('/Me', 'Me'),
		class: (UserId: number) => api<Librus.Class>(`/Classes/${UserId}`, 'Class'),
		unit: (Id: number) => api<Librus.Unit>(`/Units/${Id}`, 'Unit'),
		school: () => api<Librus.School>('/Schools', 'School'),

		users: (Ids: number[] = []) => api<Librus.User<true>[]>(`/Users/${str(Ids)}`, 'Users'),
		user: <Teacher extends boolean = true>(Id: number) =>
			api<Librus.User<Teacher>>(`/Users/${Id}`, 'User'),

		assignments: () => api<Librus.Homework[]>('/HomeWorkAssignments', 'HomeWorkAssignments'),
		assignment: (Id: string) =>
			api<Librus.Homework>(`/HomeWorkAssignments/${Id}`, 'HomeWorkAssignment'),
		assignmentMarkAsDone: (Id: number) =>
			api<string>('/HomeWorkAssignments/MarkAsDone', `{"homework":${Id}}`, 'Status', {
				'Content-Type': 'application/x-www-form-urlencoded',
			}),

		notices: () => api<Librus.Notice[]>('/SchoolNotices', 'SchoolNotices'),
		notice: (Id: string) => api<Librus.Notice>(`/SchoolNotices/${Id}`, 'SchoolNotice'),
		noticeMarkAsRead: (Id: string) => api(`/SchoolNotices/MarkAsRead/${Id}`, ''),

		colors: (Ids: number[] = []) => api<Librus.Color[]>(`/Colors/${str(Ids)}`, 'Colors'),
		color: (Id: string) => api<Librus.Color>(`/Colors/${Id}`, 'Color'),

		lessons: (Ids: number[] = []) => api<Librus.Lesson[]>(`/Lessons/${str(Ids)}`, 'Lessons'),
		lesson: (Id: number) => api<Librus.Lesson>(`/Lessons/${Id}`, 'Lesson'),

		subjects: (Ids: number[] = []) => api<Librus.Subject[]>(`/Subjects/${str(Ids)}`, 'Subjects'),
		subject: (Id: number) => api<Librus.Subject>(`/Subjects/${Id}`, 'Subject'),

		grades: () => api<Librus.Grade[]>('/Grades', 'Grades'),
		grade: (Id: number) => api<Librus.Grade>(`/Grades/${Id}`, 'Grade'),

		gradeCategories: (Ids: number[] = []) =>
			api<Librus.GradeCategory[]>(`/Grades/Categories/${str(Ids)}`, 'Categories'),
		gradeCategory: (Id: number) =>
			api<Librus.GradeCategory>(`/Grades/Categories/${Id}`, 'Category'),

		gradeComments: (Ids: number[] = []) =>
			api<Librus.GradeComment[]>(`/Grades/Comments/${str(Ids)}`, 'Comments'),
		gradeComment: (Id: number) => api<Librus.GradeComment>(`/Grades/Comments/${Id}`, 'Comment'),

		attendances: (showPresences = false, Ids: number[] = []) =>
			api<Librus.Attendance[]>(
				`/Attendances/${str(Ids)}?showPresences=${showPresences}`,
				'Attendances'
			),
		attendance: (Id: number) => api<Librus.Attendance>(`/Attendance/${Id}`, 'Attendance'),

		attendanceTypes: (Ids: number[] = []) =>
			api<Librus.AttendanceType[]>(`/Attendances/Types/${str(Ids)}`, 'Types'),
		attendanceType: (Id: number) => api<Librus.AttendanceType>(`/Attendances/Types/${Id}`, 'Type'),
	}
}
