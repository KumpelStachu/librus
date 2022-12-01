import { AppShell, Burger, MediaQuery } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import AppHeader from './AppHeader'
import AppNavbar from './AppNavbar'

type Props = {
	children: React.ReactNode
}

export default function Layout({ children }: Props) {
	const [opened, { toggle, close }] = useDisclosure(false)
	const router = useRouter()

	useEffect(() => {
		router.events.on('routeChangeStart', close)
		return () => router.events.off('routeChangeStart', close)
	})

	return (
		<AppShell
			header={
				<AppHeader>
					<MediaQuery largerThan="sm" styles={{ display: 'none' }}>
						<Burger opened={opened} onClick={toggle} size="sm" />
					</MediaQuery>
				</AppHeader>
			}
			navbarOffsetBreakpoint="sm"
			navbar={<AppNavbar opened={opened} />}
			sx={t => ({
				backgroundColor: t.fn.themeColor(t.colorScheme === 'dark' ? 'dark.8' : 'gray.0'),
				overflowX: 'hidden',
			})}
		>
			{children}
		</AppShell>
	)
}
