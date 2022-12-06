import { Indicator, Navbar, ScrollArea, Stack } from '@mantine/core'
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

	const noticesCount = notices.data?.filter(n => !n.WasRead).length
	const assignmentsCount =
		session &&
		assignments.data?.filter(a => !a.StudentsWhoMarkedAsDone.includes(session?.user.UserId)).length

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
					<Indicator
						label={noticesCount}
						inline
						size={24}
						offset={16}
						zIndex={10}
						withBorder
						position="middle-end"
						disabled={notices.isLoading || notices.isError || noticesCount === 0}
						styles={{ indicator: { pointerEvents: 'none' } }}
					>
						<NavbarLink href="/ogloszenia" icon={IconNews} loading={notices.isLoading}>
							Ogłoszenia
						</NavbarLink>
					</Indicator>
					<NavbarLink href="/plan" icon={IconBellSchool}>
						Plan lekcji
					</NavbarLink>
					<NavbarLink href="/terminarz" icon={IconCalendarEvent}>
						Terminarz
					</NavbarLink>
					<Indicator
						label={assignmentsCount}
						inline
						size={24}
						offset={16}
						zIndex={10}
						withBorder
						position="middle-end"
						disabled={assignments.isLoading || assignments.isError || assignmentsCount === 0}
						styles={{ indicator: { pointerEvents: 'none' } }}
					>
						<NavbarLink href="/zadania" icon={IconBallpen} loading={assignments.isLoading}>
							Zadania domowe
						</NavbarLink>
					</Indicator>
					<NavbarLink href="/frekwencja" icon={IconCalendarMinus}>
						Frekwencja
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
