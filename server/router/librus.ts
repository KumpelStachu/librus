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
	assignmentsCount: protectedProcedure.query(async ({ ctx }) => {
		const assignments = await ctx.librus.assignments()

		return assignments.filter(a => !a.StudentsWhoMarkedAsDone.includes(ctx.session.user.UserId))
			.length
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
		return ctx.librus.notices()
	}),
	noticesCount: protectedProcedure.query(async ({ ctx }) => {
		const notices = await ctx.librus.notices()

		return notices.filter(n => !n.WasRead).length
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
})
