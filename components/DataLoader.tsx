import { Loader, LoadingOverlay, Stack, Text } from '@mantine/core'

type Props = {
	label?: string
}

export default function DataLoader({ label }: Props) {
	return (
		<LoadingOverlay
			visible
			zIndex={10}
			loader={
				<Stack align="center">
					<Loader size="xl" />
					<Text size="xl" weight="bold">
						{label}
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
