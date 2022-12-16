import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core'
import { useDidUpdate, useHotkeys, useLocalStorage } from '@mantine/hooks'
import { ModalsProvider } from '@mantine/modals'
import { NotificationsProvider } from '@mantine/notifications'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Analytics } from '@vercel/analytics/react'
import HeadTitle from 'components/HeadTitle'
import Layout from 'components/Layout'
import AttendancesCalendar from 'components/modals/AttendancesCalendar'
import RouterTransition from 'components/RouterTransition'
import 'dayjs/locale/pl'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { trpc } from 'utils/trpc'

function App({ Component, pageProps }: AppProps) {
	const updateTheme = trpc.cookie.setTheme.useMutation()
	const theme = trpc.cookie.getTheme.useQuery(undefined, {
		refetchOnWindowFocus: false,
	})

	const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
		key: 'theme',
		defaultValue: theme.data ?? 'dark',
	})

	const toggleColorScheme = (value?: ColorScheme) =>
		setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

	useDidUpdate(() => {
		updateTheme.mutate(colorScheme)
	}, [colorScheme])

	useHotkeys([['mod+J', () => toggleColorScheme()]])

	return (
		<>
			<HeadTitle />
			<Head>
				<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
				<link rel="icon" href="/librus.png" />
			</Head>

			<ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
				<MantineProvider
					withGlobalStyles
					withNormalizeCSS
					theme={{
						colorScheme,
						defaultRadius: 'md',
						primaryColor: 'grape',
						components: {
							Container: {
								defaultProps: {
									p: 0,
								},
							},
							Paper: {
								defaultProps: {
									radius: 'lg',
								},
							},
							Calendar: {
								defaultProps: {
									locale: 'pl',
								},
							},
						},
					}}
				>
					<NotificationsProvider>
						<ModalsProvider
							modals={{
								'attendances-calendar': AttendancesCalendar,
							}}
						>
							<Layout>
								<RouterTransition />
								<Component {...pageProps} />
							</Layout>
						</ModalsProvider>
					</NotificationsProvider>
				</MantineProvider>
			</ColorSchemeProvider>

			<Analytics />
			<ReactQueryDevtools />
		</>
	)
}

export { reportWebVitals } from 'next-axiom'

export default trpc.withTRPC(App)
