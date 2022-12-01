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
	homework: protectedProcedure.query(async ({ ctx }) => {
		return ctx.librus
			.api<'HomeWorkAssignments', Librus.Homework[]>('/HomeWorkAssignments')
			.then(r => r.HomeWorkAssignments)
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
})
