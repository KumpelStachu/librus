declare namespace Librus {
	namespace OAuth {
		type Credentials = {
			username: string
			password: string
		}

		type Token = {
			access_token: string
			token_type: string
			expires_in: number
			account_group: number
			refresh_token: string
		}
	}

	type Me = {
		Account: Account
		User: User
		Class: Class
	}

	type Account = {
		Id: number
		UserId: number
		FirstName: string
		LastName: string
		Email: string
		GroupId: number
		IsActive: boolean
		Login: string
		IsPremium: boolean
		IsPremiumDemo: boolean
		ExpiredPremiumDate: number
	}

	type User = {
		Id: number
		AccountId: string
		FirstName: string
		LastName: string
		Class: Librus.API.Reference<Class> & {
			UUID: string
		}
		Unit: Librus.API.Reference<Unit>
		ClassRegisterNumber: number
		IsEmployee: boolean
		GroupId: number
	}

	type Class = {
		Id: number
	}

	type VirtualClass = {
		Id: number
	}

	type Notification = {
		Id: number
		//TODO
	}

	type SchoolFile = {
		id: string
		downloadUrl: string
		iconUrl: string
		addedOnDate: string
		displayName: string
		cloudStorageFileId: string
		fileStatus: string
		sent: boolean
		failed: boolean
		processing: boolean
		failureReason: string
	}

	type Homework = {
		Id: number
		StudentsWhoMarkedAsDone: number[]
		StudentsWhoRead: number[]
		StudentsMarkedAsDoneDate: number[]
		Teacher: Librus.API.Reference<User>
		Student: Librus.API.Reference<User>[]
		Date: string
		DueDate: string
		Text: string
		Topic: string
		VirtualClass: Librus.API.Reference<VirtualClass>
		MustSendAttachFile: boolean
		SendFilePossible: boolean
		AddedFiles: boolean
		HomeworkAssigmentFiles: unknown[]
	}

	type Notice = {
		Id: string
		StartDate: string
		EndDate: string
		Subject: string
		Content: string
		AddedBy: Librus.API.Reference<User>
		CreationDate: string
		WasRead: boolean
	}

	namespace API {
		type Response<K extends string, T> = {
			Resources: Record<'string', { Url: string }>
			Url: string
		} & Record<K, T>

		type Reference<T extends { Id: string | number }> = {
			Id: T['Id']
			Url: string
		}

		type Me = Librus.Me & {
			Refresh: number
			User: Pick<User, 'FirstName' | 'LastName'>
			Class: Librus.API.Reference<Class>
		}
	}
}
