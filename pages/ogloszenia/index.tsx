import {
	ActionIcon,
	Button,
	Container,
	Indicator,
	MediaQuery,
	Stack,
	Table,
	Text,
	Title,
} from '@mantine/core'
import { IconChevronRight } from '@tabler/icons'
import DataError from 'components/DataError'
import DataLoader from 'components/DataLoader'
import HeadTitle from 'components/HeadTitle'
import type { NextPage } from 'next'
import Link from 'next/link'
import { trpc } from 'utils/trpc'

const NoticesPage: NextPage = () => {
	const { data: notices, isLoading, error } = trpc.librus.notices.useQuery()

	if (isLoading) return <DataLoader label="Pobieranie ogłoszeń" />
	if (error) return <DataError code={error.data?.code} />

	return (
		<>
			<HeadTitle title={['Ogłoszenia']} />

			<Container size="md">
				<Stack spacing="xl">
					<Title>Ogłoszenia</Title>

					<Table
						highlightOnHover
						sx={{
							'& :is(th,td):not(:nth-of-type(2))': {
								width: '1%',
								whiteSpace: 'nowrap',
							},
						}}
					>
						<thead>
							<tr>
								<th>Data publikacji</th>
								<th>Temat</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{notices.map(notice => (
								<tr key={notice.Id}>
									<td>
										<Text weight={notice.WasRead ? 'normal' : 'bold'}>{notice.StartDate}</Text>
									</td>
									<td>
										<Indicator
											zIndex={10}
											disabled={notice.WasRead}
											position="middle-start"
											offset={-12}
										>
											<Text lineClamp={2} weight={notice.WasRead ? 'normal' : 'bold'}>
												{notice.Subject}
											</Text>
										</Indicator>
									</td>
									<td>
										<MediaQuery largerThan="xs" styles={{ display: 'none' }}>
											<ActionIcon
												size="lg"
												variant="light"
												color="primary"
												component={Link}
												href={`/ogloszenia/${notice.Id}`}
											>
												<IconChevronRight />
											</ActionIcon>
										</MediaQuery>

										<MediaQuery smallerThan="xs" styles={{ display: 'none' }}>
											<Button variant="light" component={Link} href={`/ogloszenia/${notice.Id}`}>
												Szczegóły
											</Button>
										</MediaQuery>
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

export default NoticesPage
