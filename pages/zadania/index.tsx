import { Button, Container, MediaQuery, Stack, Table, Text, Title } from '@mantine/core'
import { IconAlertCircle, IconCircleCheck } from '@tabler/icons'
import DataError from 'components/DataError'
import DataLoader from 'components/DataLoader'
import HeadTitle from 'components/HeadTitle'
import dayjs from 'dayjs'
import type { NextPage } from 'next'
import Link from 'next/link'
import { trpc } from 'utils/trpc'

const AssignmentsPage: NextPage = () => {
	const { data: assignments, isLoading, error } = trpc.librus.assignments.useQuery()

	if (isLoading) return <DataLoader label="Pobieranie zadań domowych" />
	if (error) return <DataError code={error.data?.code} />

	return (
		<>
			<HeadTitle title={['Zadania domowe']} />

			<Container size="md">
				<Stack spacing="xl">
					<Title>Zadania domowe</Title>

					<Table
						highlightOnHover
						sx={{
							'& :is(th,td):not(:nth-of-type(3))': {
								width: '1%',
								whiteSpace: 'nowrap',
							},
						}}
					>
						<thead>
							<tr>
								<MediaQuery smallerThan="xs" styles={{ display: 'none' }}>
									<th>Data dodania</th>
								</MediaQuery>
								<th>Data oddania</th>
								<th>Nazwa</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{assignments.map(assignment => (
								<tr key={assignment.Id}>
									<MediaQuery smallerThan="xs" styles={{ display: 'none' }}>
										<td>{assignment.Date}</td>
									</MediaQuery>
									<td>
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
												<IconCircleCheck size={19} />
											) : (
												dayjs().isAfter(assignment.DueDate, 'day') && <IconAlertCircle size={19} />
											)}
										</Text>
									</td>
									<td>
										<Text lineClamp={1}>{assignment.Topic}</Text>
									</td>
									<td>
										<Button variant="light" component={Link} href={`/zadania/${assignment.Id}`}>
											Zobacz
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</Stack>
			</Container>
		</>
	)
}

export default AssignmentsPage
