import { LoadingOverlay, Stack, Text } from '@mantine/core'
import { IconError404 } from '@tabler/icons'

export default function NotFound() {
	return (
		<LoadingOverlay
			visible
			zIndex={10}
			loader={
				<Stack align="center" spacing="xs">
					<IconError404 size={128} />
					<Text size={32} weight="bold">
						Nie znaleziono strony
					</Text>
				</Stack>
			}
			top="var(--mantine-header-height, 0px)"
			bottom="var(--mantine-footer-height, 0px)"
			left="var(--mantine-navbar-width, 0px)"
			right="var(--mantine-aside-width, 0px)"
		/>
	)
}
