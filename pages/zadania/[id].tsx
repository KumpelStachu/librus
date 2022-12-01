import { Button, Container, Flex, Grid, Group, Paper, Stack, Text, Title } from '@mantine/core'
import { IconAlertCircle, IconChecks, IconChevronLeft, IconCircleCheck } from '@tabler/icons'
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

	const utils = trpc.useContext()
	const { data: assignment, isLoading, error } = trpc.librus.assignment.useQuery(id)
	const markAsDone = trpc.librus.assignmentMarkAsDone.useMutation({
		onSuccess() {
			utils.librus.assignment.invalidate()
			utils.librus.assignmentsCount.invalidate()
		},
	})

	if (isLoading) return <DataLoader label="Pobieranie zadania domowego" />
	if (error) return <DataError code={error.data?.code} />

	return (
		<>
			<HeadTitle title={[assignment.Topic, 'Zadania domowe']} />

			<Group>
				<Button variant="light" component={Link} href="/zadania" leftIcon={<IconChevronLeft />}>
					Wróć do listy zadań domowych
				</Button>
				<Button
					variant="light"
					leftIcon={<IconChecks />}
					hidden={assignment.MarkedAsDone}
					onClick={() => markAsDone.mutate(assignment.Id)}
					loading={markAsDone.isLoading}
				>
					Oznacz jako wykonane
				</Button>
			</Group>

			<Container size="md" mt="xl">
				<Stack spacing="lg">
					<Title>{assignment.Topic}</Title>

					<Grid gutter="xl">
						<Grid.Col span={12} sm="content">
							<Flex direction={{ sm: 'column' }} columnGap="lg" rowGap="sm">
								<Text>
									<Text weight="bold">Nauczyciel</Text>
									{assignment.Teacher.FirstName} {assignment.Teacher.LastName}
								</Text>

								<Text>
									<Text weight="bold">Data dodania</Text>
									{assignment.Date}
								</Text>

								<Text>
									<Text weight="bold">Do oddania</Text>
									<Text
										c={
											assignment.MarkedAsDone
												? 'green.6'
												: dayjs().isAfter(assignment.DueDate, 'day')
												? 'red.6'
												: ''
										}
										sx={{ svg: { marginBottom: -4 } }}
									>
										{assignment.DueDate}&nbsp;
										{assignment.MarkedAsDone ? (
											<IconCircleCheck size={21} />
										) : (
											dayjs().isAfter(assignment.DueDate, 'day') && <IconAlertCircle size={21} />
										)}
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
											__html: AutoLinker.link(assignment.Text.trim(), {
												newWindow: true,
												truncate: { location: 'smart' },
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
