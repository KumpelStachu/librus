import { Container, Grid, Paper, Stack, Text, Title } from '@mantine/core'
import DataError from 'components/DataError'
import DataLoader from 'components/DataLoader'
import HeadTitle from 'components/HeadTitle'
import type { NextPage } from 'next'
import { trpc } from 'utils/trpc'

const SchoolInfoPage: NextPage = () => {
	const { data: info, isLoading, error } = trpc.librus.fullInfo.useQuery()

	if (isLoading) return <DataLoader label="Pobieranie informacji o szkole i klasie" />
	if (error) return <DataError code={error.data?.code} />

	return (
		<>
			<HeadTitle title={['Szkoła i klasa']} />

			<Container size="xl">
				<Grid grow>
					<Grid.Col xs="content">
						<Paper h="100%">
							<Stack spacing="sm" p="lg">
								<Title inline mb="xs">
									Szkoła
								</Title>

								<Text>
									<Text weight="bold">Nazwa</Text>
									{info.School.Name}
								</Text>

								<Text>
									<Text weight="bold">Rodzaj</Text>
									{info.Unit.Type}
								</Text>

								<Text>
									<Text weight="bold">Adres</Text>
									<Text>
										{info.School.Street} {info.School.BuildingNumber}
										{info.School.ApartmentNumber && '/'}
										{info.School.ApartmentNumber}
									</Text>
									<Text>
										{info.School.Town} {info.School.PostCode}
									</Text>
									<Text>{info.School.State}</Text>
								</Text>

								<Text>
									<Text weight="bold">Dyrektor</Text>
									{info.School.NameHeadTeacher} {info.School.SurnameHeadTeacher}
								</Text>
							</Stack>
						</Paper>
					</Grid.Col>

					<Grid.Col xs="content" miw={300}>
						<Paper h="100%">
							<Stack spacing="sm" p="lg">
								<Title inline mb="xs">
									Uczeń
								</Title>

								<Text>
									<Text weight="bold">Imię i nazwisko</Text>
									{info.Me.FirstName} {info.Me.LastName}
								</Text>

								<Text>
									<Text weight="bold">Klasa</Text>
									{info.Class.Number}
									{info.Class.Symbol}
								</Text>

								<Text>
									<Text weight="bold">Numer w dzienniku</Text>
									{info.Me.ClassRegisterNumber}
								</Text>
							</Stack>
						</Paper>
					</Grid.Col>

					<Grid.Col xs="content">
						<Paper h="100%">
							<Stack spacing="sm" p="lg">
								<Title inline mb="xs">
									Klasa
								</Title>

								<Text>
									<Text weight="bold">Nazwa</Text>
									{info.Class.Number}
									{info.Class.Symbol}
								</Text>

								<Text>
									<Text weight="bold">Wychowawca</Text>
									{info.ClassTutor.FirstName} {info.ClassTutor.LastName}
								</Text>

								<Text>
									<Text weight="bold">Początek roku szkolnego</Text>
									{info.Class.BeginSchoolYear}
								</Text>

								<Text>
									<Text weight="bold">Koniec roku szkolnego</Text>
									{info.Class.EndSchoolYear}
								</Text>

								<Text>
									<Text weight="bold">Koniec pierwszego semestru</Text>
									{info.Class.EndFirstSemester}
								</Text>
							</Stack>
						</Paper>
					</Grid.Col>
				</Grid>
			</Container>
		</>
	)
}

export default SchoolInfoPage
