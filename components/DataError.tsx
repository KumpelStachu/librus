import { LoadingOverlay, Stack, Text } from '@mantine/core'
import { IconSkull } from '@tabler/icons'

type Props = {
	code?: string
	description?: string
}

export default function DataError({ code, description }: Props) {
	return (
		<LoadingOverlay
			visible
			zIndex={10}
			loader={
				<Stack align="center" spacing="xs">
					<IconSkull size={128} />
					<Text size={32} weight="bold" color="red">
						{description ?? 'Wystąpił błąd'}
					</Text>
					<Text color="dimmed">{code}</Text>
				</Stack>
			}
			top="var(--mantine-header-height, 0px)"
			bottom="var(--mantine-footer-height, 0px)"
			left="var(--mantine-navbar-width, 0px)"
			right="var(--mantine-aside-width, 0px)"
		/>
	)
}
