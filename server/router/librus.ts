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
		const { HomeWorkAssignments } = await ctx.librus.api<'HomeWorkAssignments', Librus.Homework[]>(
			'/HomeWorkAssignments'
		)

		return HomeWorkAssignments.map(a => ({
			...a,
			MarkedAsDone: a.StudentsWhoMarkedAsDone.includes(ctx.session.user.UserId),
		}))
	}),
	assignmentsCount: protectedProcedure.query(async ({ ctx }) => {
		const { HomeWorkAssignments } = await ctx.librus.api<'HomeWorkAssignments', Librus.Homework[]>(
			'/HomeWorkAssignments'
		)

		return HomeWorkAssignments.filter(
			a => !a.StudentsWhoMarkedAsDone.includes(ctx.session.user.UserId)
		).length
	}),
	assignment: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
		const { HomeWorkAssignment } = await ctx.librus.api<'HomeWorkAssignment', Librus.Homework>(
			`/HomeWorkAssignments/${input}`
		)

		const { User } = await ctx.librus.api<'User', Librus.User<true>>(
			`/Users/${HomeWorkAssignment.Teacher.Id}`
		)

		return {
			...HomeWorkAssignment,
			Teacher: User,
			MarkedAsDone: HomeWorkAssignment.StudentsWhoMarkedAsDone.includes(ctx.session.user.UserId),
		}
	}),
	assignmentMarkAsDone: protectedProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
		return ctx.librus
			.api<'Status', string>('/HomeWorkAssignments/MarkAsDone', `{"homework":${input}}`, {
				'Content-Type': 'application/x-www-form-urlencoded',
			})
			.then(r => r.Status)
	}),
	notices: protectedProcedure.query(async ({ ctx }) => {
		return ctx.librus
			.api<'SchoolNotices', Librus.Notice[]>('/SchoolNotices')
			.then(r => r.SchoolNotices)
	}),
	noticesCount: protectedProcedure.query(async ({ ctx }) => {
		const { SchoolNotices } = await ctx.librus.api<'SchoolNotices', Librus.Notice[]>(
			'/SchoolNotices'
		)

		return SchoolNotices.filter(n => !n.WasRead).length
	}),
	notice: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
		const { SchoolNotice } = await ctx.librus.api<'SchoolNotice', Librus.Notice>(
			`/SchoolNotices/${input}`
		)

		const { User } = await ctx.librus.api<'User', Librus.User<true>>(
			`/Users/${SchoolNotice.AddedBy.Id}`
		)

		return {
			...SchoolNotice,
			AddedBy: User,
		}
	}),
	noticeMarkAsRead: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
		return ctx.librus.api(`/SchoolNotices/MarkAsRead/${input}`, '')
	}),
	fullInfo: protectedProcedure.query(async ({ ctx }) => {
		const { User: Me } = await ctx.librus.api<'User', Librus.User>(
			`/Users/${ctx.session.user.UserId}`
		)
		const { Class } = await ctx.librus.api<'Class', Librus.Class>(`/Classes/${Me.Class.Id}`)
		const { User: ClassTutor } = await ctx.librus.api<'User', Librus.User<true>>(
			`/Users/${Class.ClassTutor.Id}`
		)
		const { Unit } = await ctx.librus.api<'Unit', Librus.Unit>(`/Units/${Class.Unit.Id}`)
		const { School } = await ctx.librus.api<'School', Librus.School>('/Schools')

		return {
			Me,
			Unit,
			School,
			Class,
			ClassTutor,
		}
	}),
})
