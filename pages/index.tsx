import DataError from 'components/DataError'
import DataLoader from 'components/DataLoader'
import type { NextPage } from 'next'
import { trpc } from 'utils/trpc'

const NotificationsPage: NextPage = () => {
	const { data: notifications, isLoading, error } = trpc.librus.notifications.useQuery()

	if (isLoading) return <DataLoader label="Pobieranie powiadomień" />
	if (error) return <DataError code={error.data?.code} />

	// TODO

	return <pre>{JSON.stringify(notifications, null, 2)}</pre>
}

export default NotificationsPage
