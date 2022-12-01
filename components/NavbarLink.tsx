import { Box, Button, Group } from '@mantine/core'
import { TablerIcon } from '@tabler/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'

type Props = {
	exact?: boolean
	icon?: TablerIcon
	href: string
	children: string
}

export default function NavbarLink({ exact, icon: Icon, href, children }: Props) {
	const { pathname } = useRouter()

	return (
		<Button
			variant={(exact ? pathname === href : pathname.startsWith(href)) ? 'light' : 'subtle'}
			component={Link}
			href={href}
			fullWidth
			styles={{
				label: {
					flex: 1,
				},
			}}
		>
			<Group>
				{Icon ? <Icon size={20} /> : <Box w={20} />}
				{children}
			</Group>
		</Button>
	)
}
