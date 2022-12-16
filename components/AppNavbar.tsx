import { Navbar, ScrollArea, Stack } from '@mantine/core'
import {
	IconBallpen,
	IconBell,
	IconBellSchool,
	IconCalendarEvent,
	IconCalendarMinus,
	IconFiles,
	IconMail,
	IconNews,
	IconNumbers,
	IconSchool,
} from '@tabler/icons'
import useSession from 'hooks/useSession'
import { trpc } from 'utils/trpc'
import NavbarLink from './NavbarLink'

type Props = {
	opened: boolean
}

export default function AppNavbar({ opened }: Props) {
	const { session } = useSession()

	const notices = trpc.librus.notices.useQuery()
	const assignments = trpc.librus.assignments.useQuery()
	const attendances = trpc.librus.attendances.useQuery()

	const noticesCount = notices.data?.filter(n => !n.WasRead).length
	const assignmentsCount = assignments.data?.filter(
		a => !a.StudentsWhoMarkedAsDone.includes(session!.user.UserId)
	).length

	return (
		<Navbar width={{ sm: 260 }} hiddenBreakpoint="sm" hidden={!opened}>
			<ScrollArea>
				<Stack spacing="xs" p="xs">
					<NavbarLink href="/" icon={IconBell} exact>
						Centrum powiadomień
					</NavbarLink>
					<NavbarLink href="/oceny" icon={IconNumbers}>
						Oceny i Zachowanie
					</NavbarLink>
					<NavbarLink href="/wiadomosci" icon={IconMail}>
						Wiadomości
					</NavbarLink>

					<NavbarLink
						href="/ogloszenia"
						icon={IconNews}
						loading={notices.isLoading}
						indicator={noticesCount}
					>
						Ogłoszenia
					</NavbarLink>
					<NavbarLink href="/plan" icon={IconBellSchool}>
						Plan lekcji
					</NavbarLink>
					<NavbarLink href="/terminarz" icon={IconCalendarEvent}>
						Terminarz
					</NavbarLink>
					<NavbarLink
						href="/zadania"
						icon={IconBallpen}
						loading={assignments.isLoading}
						indicator={assignmentsCount}
					>
						Zadania domowe
					</NavbarLink>
					<NavbarLink
						href="/frekwencja"
						icon={IconCalendarMinus}
						loading={attendances.isLoading}
						indicator={attendances.data?.length}
					>
						Nieobecności
					</NavbarLink>
					<NavbarLink href="/szkola" icon={IconSchool}>
						Szkoła i klasa
					</NavbarLink>
					<NavbarLink href="/pliki" icon={IconFiles}>
						Pliki szkoły
					</NavbarLink>
				</Stack>
			</ScrollArea>
		</Navbar>
	)
}
