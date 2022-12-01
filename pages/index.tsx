import DataError from 'components/DataError'
import DataLoader from 'components/DataLoader'
import type { NextPage } from 'next'
import { trpc } from 'utils/trpc'

const NotificationsPage: NextPage = () => {
	const notifications = trpc.librus.notifications.useQuery()

	if (notifications.isLoading) return <DataLoader label="Pobieranie powiadomień" />
	if (notifications.error) return <DataError code={notifications.error.data?.code} />

	// TODO

	return <pre>{JSON.stringify(notifications.data, null, 2)}</pre>
}

export default NotificationsPage
