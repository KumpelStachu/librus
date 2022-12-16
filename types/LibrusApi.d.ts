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
			issued_at: number
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

	type User<Employee extends boolean = false> = {
		Id: number
		AccountId: string
		FirstName: Employee extends true ? string | null : string
		LastName: string
		GroupId: number
	} & (Employee extends true
		? { IsEmployee: true }
		: {
				IsEmployee: false
				IsPedagogue?: true
				IsSchoolAdministrator?: true
				ClassRegisterNumber: number
				Unit: Librus.API.Reference<Unit>
				Class: Librus.API.Reference<Class> & {
					UUID: string
				}
		  })

	type Class = {
		Id: number
		Number: number
		Symbol: string
		BeginSchoolYear: string
		EndFirstSemester: string
		EndSchoolYear: string
		Unit: Librus.API.Reference<Unit>
		ClassTutor: Librus.API.Reference<User>
		ClassTutors: Librus.API.Reference<User>[]
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

	type Unit = {
		Id: number
		Name: string
		ShortName: string
		Type: string
		BehaviourType: `${number}`
		GradesSettings: {
			StandardGradesEnabled: boolean
			PointGradesEnabled: boolean
			DescriptiveGradesEnabled: boolean
			ForcePointGradesDictionaries: boolean
			AllowOverrangePointGrades: boolean
			AllowClassTutorEditGrades: boolean
			CanAddAnyGrades: boolean
		}
		LessonSettings: {
			AllowZeroLessonNumber: boolean
			MaxLessonNumber: number
			IsExtramuralCourse: boolean
			IsAdultsDaily: boolean
			AllowAddOtherLessons: boolean
			AllowAddSubstitutions: boolean
		}
		LessonsRange: LessonsRange
		BehaviourGradesSettings: {
			StartPoints: {
				Semester1: number
				Semester2: number
			}
			ShowCategoriesShortcuts: boolean
		}
	}

	type LessonsRange = {
		From: string
		To: string
		RawFrom: null
		RawTo: null
	}[]

	type School = {
		Id: number
		Name: string
		Town: string
		Street: string
		State: string
		BuildingNumber: string
		ApartmentNumber: string
		LessonsRange: LessonsRange
		SchoolYear: number
		VocationalSchool: number
		NameHeadTeacher: string
		SurnameHeadTeacher: string
		Project: number
		PostCode: string
		Service: {
			IsSynergy: boolean
			Url: string
			Variant: {
				Name: string
				DisplayName: string
			}
		}
	}

	type Color = {
		Id: number
		RGB: string
		Name: string
	}

	type Lesson = {
		Id: number
		Teacher: Librus.API.Reference<User<true>>
		Subject: Librus.API.Reference<Subject>
		Class: Librus.API.Reference<Class>
	}

	type Subject = {
		Id: number
		Name: string
		No: number
		Short: string
		IsExtracurricular: boolean
		IsBlockLesson: boolean
	}

	type GradeCategory = {
		Id: number
		Teacher: Librus.API.Reference<User<true>>
		Color: Librus.API.Reference<Color>
		Name: string
		AdultsExtramural: boolean
		AdultsDaily: boolean
		Standard: boolean
		IsReadOnly: '0' | '1'
		Short: string
		ForLessons: Librus.API.Reference<Lesson>[]
		BlockAnyGrades: boolean
		ObligationToPerform: boolean
	}

	type GradeComment = {
		Id: number
		AddedBy: Librus.API.Reference<User<true>>
		Grade: Librus.API.Reference<Grade>
		Text: string
	}

	type Grade = {
		Id: number
		Lesson: Librus.API.Reference<Lesson>
		Subject: Librus.API.Reference<Subject>
		Student: Librus.API.Reference<User>
		Category: Librus.API.Reference<GradeCategory>
		AddedBy: Librus.API.Reference<User<true>>
		Grade: string
		Date: string
		AddDate: string
		Semester: 1 | 2
		IsConstituent: boolean
		IsSemester: boolean
		IsSemesterProposition: boolean
		IsFinal: boolean
		IsFinalProposition: boolean
		Comments?: Librus.API.Reference<GradeComment>[]
	}

	type Attendance = {
		Id: number
		Lesson: Librus.API.Reference<Lesson>
		Student: Librus.API.Reference<User>
		Date: string
		AddDate: string
		LessonNo: number
		Semester: number
		Type: Librus.API.Reference<AttendanceType>
		AddedBy: Librus.API.Reference<User>
	}

	type AttendanceType = {
		Id: number
		Name: string
		Short: string
		IsPresenceKind: boolean
		Order: number
		Identifier: string
	} & (
		| {
				Standard: true
				ColorRGB: string
				StandardType: undefined
				Color: undefined
		  }
		| {
				Standard: false
				ColorRGB: undefined
				StandardType: Librus.API.Reference<AttendanceType>
				Color: Librus.API.Reference<Color>
		  }
	)

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
