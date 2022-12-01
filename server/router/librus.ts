import { protectedProcedure, router } from 'server/trpc'
import { z } from 'zod'

export const librusRouter = router({
	me: protectedProcedure.query(async ({ ctx }) => {
		return ctx.librus.api<'Me', Librus.Me>('/Me').then(r => r.Me)
	}),
	notifications: protectedProcedure.query(async ({ ctx }) => {
		return ctx.librus
			.api<'data', Librus.Notification[]>(`/NotificationCenterDeferrals/${ctx.session.user.Id}`)
			.then(r => r.data)
	}),
	files: protectedProcedure.query(async ({ ctx }) => {
		return ctx.librus.api<'Data', Librus.SchoolFile[]>('/SchoolFiles').then(r => r.Data)
	}),
	assignments: protectedProcedure.query(async ({ ctx }) => {
		return ctx.librus
			.api<'HomeWorkAssignments', Librus.Homework[]>('/HomeWorkAssignments')
			.then(r => r.HomeWorkAssignments)
	}),
	assignmentsCount: protectedProcedure.query(async ({ ctx }) => {
		const assignments = await ctx.librus
			.api<'HomeWorkAssignments', Librus.Homework[]>('/HomeWorkAssignments')
			.then(r => r.HomeWorkAssignments)

		return assignments.filter(a => !a.StudentsWhoMarkedAsDone.includes(ctx.session.user.UserId))
			.length
	}),
	assignment: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
		const assignment = await ctx.librus
			.api<'HomeWorkAssignment', Librus.Homework>(`/HomeWorkAssignments/${input}`)
			.then(r => r.HomeWorkAssignment)

		const teacher = await ctx.librus
			.api<'User', Librus.User>(`/Users/${assignment.Teacher.Id}`)
			.then(r => r.User)

		return {
			...assignment,
			Teacher: teacher,
		}
	}),
	notices: protectedProcedure.query(async ({ ctx }) => {
		return ctx.librus
			.api<'SchoolNotices', Librus.Notice[]>('/SchoolNotices')
			.then(r => r.SchoolNotices)
	}),
	noticesCount: protectedProcedure.query(async ({ ctx }) => {
		const notices = await ctx.librus
			.api<'SchoolNotices', Librus.Notice[]>('/SchoolNotices')
			.then(r => r.SchoolNotices)

		return notices.filter(n => !n.WasRead).length
	}),
	notice: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
		const notice = await ctx.librus
			.api<'SchoolNotice', Librus.Notice>(`/SchoolNotices/${input}`)
			.then(r => r.SchoolNotice)

		const teacher = await ctx.librus
			.api<'User', Librus.User>(`/Users/${notice.AddedBy.Id}`)
			.then(r => r.User)

		return {
			...notice,
			AddedBy: teacher,
		}
	}),
	noticeMarkAsRead: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
		return ctx.librus.api(`/SchoolNotices/MarkAsRead/${input}`, 'POST')
	}),
})
