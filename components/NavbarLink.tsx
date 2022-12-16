import { Box, Button, Group, Indicator } from '@mantine/core'
import { TablerIcon } from '@tabler/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'

type Props = {
	exact?: boolean
	icon?: TablerIcon
	href: string
	loading?: boolean
	indicator?: number
	children: string
}

export default function NavbarLink({
	exact,
	icon: Icon,
	href,
	loading,
	indicator,
	children,
}: Props) {
	const { pathname } = useRouter()

	return (
		<Wrapper label={indicator ?? 0}>
			<Button
				variant={(exact ? pathname === href : pathname.startsWith(href)) ? 'light' : 'subtle'}
				loading={loading}
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
		</Wrapper>
	)
}

type WrapperProps = {
	label: number
	children: React.ReactElement
}

function Wrapper({ label, children }: WrapperProps) {
	if (!label) return children

	return (
		<Indicator
			label={label}
			inline
			size={24}
			offset={16 + Math.floor(Math.log10(label)) * 4}
			zIndex={10}
			withBorder
			overflowCount={999}
			position="middle-end"
			styles={{ indicator: { pointerEvents: 'none' } }}
		>
			{children}
		</Indicator>
	)
}
