import { Button, Container, Grid, Paper, Stack, Text, Title } from '@mantine/core'
import { IconChevronLeft } from '@tabler/icons'
import DataError from 'components/DataError'
import DataLoader from 'components/DataLoader'
import HeadTitle from 'components/HeadTitle'
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

			<Container p={0} size="md">
				<Stack spacing="lg">
					<Title>{assignment.data.Topic}</Title>

					<Grid gutter="xl">
						<Grid.Col span={12} sm="content">
							<Stack
								sx={t => ({
									[t.fn.smallerThan('sm')]: {
										flexDirection: 'row',
									},
								})}
							>
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
									{assignment.data.DueDate}
								</Text>
							</Stack>
						</Grid.Col>

						<Grid.Col span="auto">
							<Paper p="lg" sx={{ minHeight: '100%' }}>
								<Stack spacing="md">
									<Title inline order={3}>
										Opis
									</Title>
									<Text inline component="pre">
										{assignment.data.Text}
									</Text>
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
