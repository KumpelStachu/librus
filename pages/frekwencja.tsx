import {
	Accordion,
	ActionIcon,
	Badge,
	ColorSwatch,
	Container,
	Group,
	Stack,
	Text,
	Title,
	Tooltip,
} from '@mantine/core'
import { openContextModal } from '@mantine/modals'
import { IconCalendarStats } from '@tabler/icons'
import DataError from 'components/DataError'
import DataLoader from 'components/DataLoader'
import HeadTitle from 'components/HeadTitle'
import dayjs from 'dayjs'
import type { NextPage } from 'next'
import { trpc } from 'utils/trpc'
import { groupBy } from 'utils/utils'

const AttendancePage: NextPage = () => {
	const {
		data: attendances,
		isLoading,
		error,
	} = trpc.librus.attendances.useQuery({}, { select: d => groupBy(d, i => i.Lesson.Subject.Name) })

	if (isLoading) return <DataLoader label="Pobieranie frekwencji" />
	if (error) return <DataError code={error.data?.code} />

	return (
		<>
			<HeadTitle title={['Nieobecności']} />

			<Container>
				<Stack spacing="xl">
					<Title>Nieobecności</Title>

					<Accordion variant="contained" chevronPosition="left">
						{Object.entries(attendances)
							.sort(([, [a]], [, [b]]) => dayjs(a.Date).diff(b.Date))
							.map(([key, items]) => (
								<Accordion.Item key={key} value={key}>
									<Accordion.Control py="xs">
										<Group position="apart" noWrap>
											<Group spacing="xs" noWrap>
												<Badge sx={{ flexShrink: 0 }}>{items.length}</Badge>
												<Text>{key}</Text>
											</Group>
											<Tooltip label="Pokaż kalendarz" position="left">
												<ActionIcon
													size="lg"
													color="primary"
													variant="light"
													onClick={e => {
														e.stopPropagation()
														openContextModal({
															modal: 'attendances-calendar',
															title: <Text weight="bold">{key}</Text>,
															size: 576,
															innerProps: {
																dates: items.map(i => dayjs(i.Date).toDate()),
															},
														})
													}}
												>
													<IconCalendarStats size={20} />
												</ActionIcon>
											</Tooltip>
										</Group>
									</Accordion.Control>
									<Accordion.Panel>
										<Stack>
											{items.map(item => (
												<Group key={item.Id} spacing="xs">
													<ColorSwatch color={`#${item.Type.ColorRGB}`} />
													<Text>
														{item.Id} - {item.Date} - {item.Type.Name}
													</Text>
												</Group>
											))}
										</Stack>
									</Accordion.Panel>
								</Accordion.Item>
							))}
					</Accordion>
				</Stack>
			</Container>
		</>
	)
}

export default AttendancePage
