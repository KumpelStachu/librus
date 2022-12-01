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
import { trpc } from 'utils/trpc'
import NavbarLink from './NavbarLink'

type Props = {
	opened: boolean
}

export default function AppNavbar({ opened }: Props) {
	const notices = trpc.librus.noticesCount.useQuery()
	const assignments = trpc.librus.assignmentsCount.useQuery()

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
						label={notices.data}
						inline
						size={24}
						offset={16}
						zIndex={10}
						withBorder
						position="middle-end"
						disabled={notices.isLoading || notices.isError || notices.data === 0}
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
						label={assignments.data}
						inline
						size={24}
						offset={16}
						zIndex={10}
						withBorder
						position="middle-end"
						disabled={assignments.isLoading || assignments.isError || assignments.data === 0}
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
