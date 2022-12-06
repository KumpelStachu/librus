import DataError from 'components/DataError'
import DataLoader from 'components/DataLoader'
import type { NextPage } from 'next'
import { trpc } from 'utils/trpc'

const GradesPage: NextPage = () => {
	const { data: grades, isLoading, error } = trpc.librus.grades.useQuery()

	if (isLoading) return <DataLoader label="Pobieranie ocen" />
	if (error) return <DataError code={error.data?.code} />

	return <pre>{JSON.stringify(grades, null, 2)}</pre>
}

export default GradesPage
