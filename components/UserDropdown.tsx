import { Button, Menu } from '@mantine/core'
import { IconLogout, IconUser } from '@tabler/icons'
import useSession from 'hooks/useSession'
import { signOut } from 'next-auth/react'

export default function UserDropdown() {
	const { session } = useSession()

	return (
		<Menu width={160} position="bottom-end" closeOnItemClick={false} withinPortal>
			<Menu.Target>
				<Button loading={!session} variant="default" leftIcon={<IconUser size={20} />}>
					{session?.user.id}
				</Button>
			</Menu.Target>
			<Menu.Dropdown>
				<Menu.Label>Zalogowano jako</Menu.Label>
				<Menu.Item>
					{session?.user.FirstName} {session?.user.LastName}
				</Menu.Item>

				<Menu.Divider />

				<Menu.Item icon={<IconLogout size={16} />} onClick={() => signOut()}>
					Wyloguj się
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	)
}
