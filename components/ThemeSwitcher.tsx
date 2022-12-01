import { ActionIcon, useMantineColorScheme } from '@mantine/core'
import { IconMoon, IconSun } from '@tabler/icons'

export default function ThemeSwitcher() {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme()

	return (
		<ActionIcon
			variant="default"
			size="lg"
			onClick={() => toggleColorScheme()}
			sx={t => ({ color: t.fn.themeColor(t.colorScheme === 'dark' ? 'yellow' : 'blue', 5) })}
		>
			{colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
		</ActionIcon>
	)
}
