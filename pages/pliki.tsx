import { Button, Stack, Table, Title } from '@mantine/core'
import DataError from 'components/DataError'
import DataLoader from 'components/DataLoader'
import type { NextPage } from 'next'
import { trpc } from 'utils/trpc'

const FilesPage: NextPage = () => {
	const files = trpc.librus.files.useQuery()

	if (files.isLoading) return <DataLoader label="Pobieranie plików" />
	if (files.error) return <DataError code={files.error.data?.code} />

	return (
		<Stack spacing="xl">
			<Title>Pliki szkoły</Title>

			<Table>
				<thead>
					<tr>
						<th>Data udostępnienia</th>
						<th>Nazwa</th>
						<th>Akcje</th>
					</tr>
				</thead>
				<tbody>
					{files.data?.map(file => (
						<tr key={file.id}>
							<td>{file.addedOnDate}</td>
							<td>{file.displayName}</td>
							<td>
								<Button
									component="a"
									target="_blank"
									href={`https://synergia.librus.pl${file.downloadUrl}`}
								>
									Pobierz
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</Stack>
	)
}

export default FilesPage
