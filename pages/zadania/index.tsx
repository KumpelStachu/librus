import { Button, Container, MediaQuery, Stack, Table, Text, Title } from '@mantine/core'
import DataError from 'components/DataError'
import DataLoader from 'components/DataLoader'
import type { NextPage } from 'next'
import Link from 'next/link'
import { trpc } from 'utils/trpc'

const HomeworkPage: NextPage = () => {
	const homework = trpc.librus.homework.useQuery()

	if (homework.isLoading) return <DataLoader label="Pobieranie zadań domowych" />
	if (homework.error) return <DataError code={homework.error.data?.code} />

	return (
		<Container p={0} size="md">
			<Stack spacing="xl">
				<Title>Zadania domowe</Title>
				<Table
					highlightOnHover
					sx={{
						'& :is(th,td):not(:nth-child(3))': {
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
							<th>Akcje</th>
						</tr>
					</thead>
					<tbody>
						{homework.data?.map(assignment => (
							<tr key={assignment.Id}>
								<MediaQuery smallerThan="xs" styles={{ display: 'none' }}>
									<td>{assignment.Date}</td>
								</MediaQuery>
								<td>{assignment.DueDate}</td>
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

export default HomeworkPage