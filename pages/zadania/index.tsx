import { Button, Container, MediaQuery, Stack, Table, Text, Title } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons'
import DataError from 'components/DataError'
import DataLoader from 'components/DataLoader'
import dayjs from 'dayjs'
import type { NextPage } from 'next'
import Link from 'next/link'
import { trpc } from 'utils/trpc'

const AssignmentsPage: NextPage = () => {
	const assignments = trpc.librus.assignments.useQuery()

	if (assignments.isLoading) return <DataLoader label="Pobieranie zadań domowych" />
	if (assignments.error) return <DataError code={assignments.error.data?.code} />

	return (
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
						{assignments.data?.map(assignment => (
							<tr key={assignment.Id}>
								<MediaQuery smallerThan="xs" styles={{ display: 'none' }}>
									<td>{assignment.Date}</td>
								</MediaQuery>
								<td>
									<Text
										c={dayjs().isAfter(assignment.DueDate, 'day') ? 'red.6' : ''}
										sx={{ svg: { marginBottom: -4 } }}
									>
										{assignment.DueDate} <IconAlertCircle size={19} />
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
	)
}

export default AssignmentsPage
