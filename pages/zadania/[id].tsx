import { Button, Container, Flex, Grid, Paper, Stack, Text, Title } from '@mantine/core'
import { IconAlertCircle, IconChevronLeft } from '@tabler/icons'
import AutoLinker from 'autolinker'
import DataError from 'components/DataError'
import DataLoader from 'components/DataLoader'
import HeadTitle from 'components/HeadTitle'
import dayjs from 'dayjs'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { trpc } from 'utils/trpc'

const AssignmentPage: NextPage = () => {
	const router = useRouter()
	const id = router.query.id as string

	const assignment = trpc.librus.assignment.useQuery(id)

	if (assignment.isLoading) return <DataLoader label="Pobieranie zadania domowego" />
	if (assignment.error) return <DataError code={assignment.error.data?.code} />

	return (
		<>
			<HeadTitle title={[assignment.data.Topic, 'Zadania domowe']} />
			<Button
				mb="xl"
				variant="light"
				component={Link}
				href="/zadania"
				leftIcon={<IconChevronLeft />}
			>
				Wróć do listy zadań domowych
			</Button>

			<Container size="md">
				<Stack spacing="lg">
					<Title>{assignment.data.Topic}</Title>

					<Grid gutter="xl">
						<Grid.Col span={12} sm="content">
							<Flex direction={{ sm: 'column' }} columnGap="lg" rowGap="sm">
								<Text>
									<Text weight="bold">Nauczyciel</Text>
									{assignment.data.Teacher.FirstName} {assignment.data.Teacher.LastName}
								</Text>

								<Text>
									<Text weight="bold">Data dodania</Text>
									{assignment.data.Date}
								</Text>

								<Text>
									<Text weight="bold">Do oddania</Text>
									<Text
										c={dayjs().isAfter(assignment.data.DueDate, 'day') ? 'red.6' : ''}
										sx={{ svg: { marginBottom: -4 } }}
									>
										{assignment.data.DueDate} <IconAlertCircle size={21} />
									</Text>
								</Text>
							</Flex>
						</Grid.Col>

						<Grid.Col span="auto">
							<Paper p="lg" sx={{ minHeight: '100%' }} withBorder>
								<Stack spacing="md">
									<Title inline order={2}>
										Opis
									</Title>
									<Text
										sx={{ whiteSpace: 'pre-wrap', a: { wordBreak: 'break-all' } }}
										dangerouslySetInnerHTML={{
											__html: AutoLinker.link(assignment.data.Text, {
												newWindow: true,
												truncate: { location: 'middle' },
												sanitizeHtml: true,
											}),
										}}
									/>
								</Stack>
							</Paper>
						</Grid.Col>
					</Grid>
				</Stack>
			</Container>
		</>
	)
}

export default AssignmentPage
