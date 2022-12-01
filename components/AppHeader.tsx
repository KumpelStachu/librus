import { Group, Header, MediaQuery, Title } from '@mantine/core'
import ThemeSwitcher from './ThemeSwitcher'
import UserDropdown from './UserDropdown'

type Props = {
	children: React.ReactNode
}

export default function AppHeader({ children }: Props) {
	return (
		<Header height={56} px="sm">
			<Group style={{ height: '100%' }} spacing="xs" position="apart" noWrap>
				{children}
				<MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
					<Title order={2} ml={6}>
						Librus
					</Title>
				</MediaQuery>

				<Group spacing="xs">
					<ThemeSwitcher />
					<UserDropdown />
				</Group>
			</Group>
		</Header>
	)
}
