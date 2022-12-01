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
import NavbarLink from './NavbarLink'

type Props = {
	opened: boolean
}

export default function AppNavbar({ opened }: Props) {
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
					<NavbarLink href="/ogloszenia" icon={IconNews}>
						Ogłoszenia
					</NavbarLink>
					<NavbarLink href="/plan" icon={IconBellSchool}>
						Plan lekcji
					</NavbarLink>
					<NavbarLink href="/terminarz" icon={IconCalendarEvent}>
						Terminarz
					</NavbarLink>
					<NavbarLink href="/zadania" icon={IconBallpen}>
						Zadania domowe
					</NavbarLink>
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
