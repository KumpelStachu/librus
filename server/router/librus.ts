import dayjs from 'dayjs'
import { protectedProcedure, router } from 'server/trpc'
import { z } from 'zod'

export const librusRouter = router({
	me: protectedProcedure.query(async ({ ctx }) => {
		return ctx.librus.me()
	}),
	notifications: protectedProcedure.query(async ({ ctx }) => {
		return ctx.librus.notifications(ctx.session.user.Id)
	}),
	files: protectedProcedure.query(async ({ ctx }) => {
		return ctx.librus.files()
	}),
	assignments: protectedProcedure.query(async ({ ctx }) => {
		const assignments = await ctx.librus.assignments()

		return assignments.map(a => ({
			...a,
			MarkedAsDone: a.StudentsWhoMarkedAsDone.includes(ctx.session.user.UserId),
		}))
	}),
	assignment: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
		const assignment = await ctx.librus.assignment(input)
		const teacher = await ctx.librus.user(assignment.Teacher.Id)

		return {
			...assignment,
			Teacher: teacher,
			MarkedAsDone: assignment.StudentsWhoMarkedAsDone.includes(ctx.session.user.UserId),
		}
	}),
	assignmentMarkAsDone: protectedProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
		return ctx.librus.assignmentMarkAsDone(input)
	}),
	notices: protectedProcedure.query(async ({ ctx }) => {
		const notices = await ctx.librus.notices()
		return notices.sort((a, b) => dayjs(b.CreationDate).diff(a.CreationDate))
	}),
	notice: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
		const notice = await ctx.librus.notice(input)
		const teacher = await ctx.librus.user(notice.AddedBy.Id)

		return {
			...notice,
			AddedBy: teacher,
		}
	}),
	noticeMarkAsRead: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
		return ctx.librus.noticeMarkAsRead(input)
	}),
	fullInfo: protectedProcedure.query(async ({ ctx }) => {
		const Me = await ctx.librus.user<false>(ctx.session.user.UserId)
		const Class = await ctx.librus.class(Me.Class.Id)
		const ClassTutor = await ctx.librus.user(Class.ClassTutor.Id)
		const Unit = await ctx.librus.unit(Class.Unit.Id)
		const School = await ctx.librus.school()

		return {
			Me,
			Unit,
			School,
			Class,
			ClassTutor,
		}
	}),
	grades: protectedProcedure.query(async ({ ctx }) => {
		const grades = await ctx.librus.grades()
		const teachers = await ctx.librus.users(grades.map(g => g.AddedBy.Id))
		const categories = await ctx.librus.gradeCategories(grades.map(g => g.Category.Id))
		const lessons = await ctx.librus.lessons(grades.map(g => g.Lesson.Id))
		const subjects = await ctx.librus.subjects(grades.map(g => g.Subject.Id))
		const colors = await ctx.librus.subjects(categories.map(c => c.Color.Id))
		const comments = await ctx.librus.gradeComments(
			grades.filter(g => g.Comments?.length).flatMap(g => g.Comments!.map(c => c.Id))
		)

		return grades.map(grade => {
			const category = categories.find(c => c.Id === grade.Category.Id)!

			return {
				...grade,
				AddedBy: teachers.find(t => t.Id === grade.AddedBy.Id)!,
				Category: {
					...category,
					Color: colors.find(c => c.Id === category.Color.Id)!,
				},
				Lesson: lessons.find(c => c.Id === grade.Category.Id)!,
				Subject: subjects.find(c => c.Id === grade.Category.Id)!,
				Comments: comments.filter(c => grade.Comments?.map(c => c.Id).includes(c.Id)),
			}
		})
	}),
	attendances: protectedProcedure
		.input(z.object({ showPresences: z.boolean().default(false) }).default({}))
		.query(async ({ ctx, input }) => {
			const Attendances = await ctx.librus.attendances(input.showPresences)
			const Types = await ctx.librus.attendanceTypes(Attendances.map(a => a.Type.Id))
			const Lessons = await ctx.librus.lessons(Attendances.map(a => a.Lesson.Id))
			const Subjects = await ctx.librus.subjects(Lessons.map(l => l.Subject.Id))
			const Users = await ctx.librus.users()
			const Colors = await ctx.librus.colors()

			return Attendances.map(a => {
				const Type = Types.find(t => t.Id === a.Type.Id)!
				const Lesson = Lessons.find(l => l.Id === a.Lesson.Id)!

				return {
					...a,
					AddedBy: Users.find(u => u.Id === a.AddedBy.Id)!,
					Lesson: {
						...Lesson,
						Teacher: Users.find(u => u.Id === Lesson.Teacher.Id)!,
						Subject: Subjects.find(s => s.Id === Lesson.Subject.Id)!,
					},
					Type: Type.Standard
						? Type
						: { ...Type, ColorRGB: Colors.find(c => c.Id === Type.Color.Id)!.RGB },
				}
			})
		}),
})
