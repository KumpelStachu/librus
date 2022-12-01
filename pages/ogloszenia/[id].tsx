import { Button, Container, Flex, Grid, Group, Paper, Stack, Text, Title } from '@mantine/core'
import { IconChevronLeft, IconEyeCheck } from '@tabler/icons'
import AutoLinker from 'autolinker'
import DataError from 'components/DataError'
import DataLoader from 'components/DataLoader'
import HeadTitle from 'components/HeadTitle'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { trpc } from 'utils/trpc'

const NoticePage: NextPage = () => {
	const router = useRouter()
	const id = router.query.id as string

	const utils = trpc.useContext()
	const notice = trpc.librus.notice.useQuery(id)
	const markAsRead = trpc.librus.noticeMarkAsRead.useMutation({
		onSuccess() {
			utils.librus.notice.invalidate()
			utils.librus.noticesCount.invalidate()
		},
	})

	if (notice.isLoading) return <DataLoader label="Pobieranie ogłoszenia" />
	if (notice.error) return <DataError code={notice.error.data?.code} />

	return (
		<>
			<HeadTitle title={[notice.data.Subject, 'Ogłoszenia']} />
			<Group>
				<Button variant="light" component={Link} href="/ogloszenia" leftIcon={<IconChevronLeft />}>
					Wróć do listy ogłoszeń
				</Button>
				<Button
					variant="light"
					leftIcon={<IconEyeCheck />}
					hidden={notice.data.WasRead}
					onClick={() => markAsRead.mutate(id)}
					loading={markAsRead.isLoading}
				>
					Oznacz jako przeczytane
				</Button>
			</Group>

			<Container size="md" mt="xl">
				<Stack spacing="lg">
					<Title>{notice.data.Subject}</Title>

					<Grid gutter="xl">
						<Grid.Col span={12} sm="content">
							<Flex
								direction={{ sm: 'column' }}
								columnGap="lg"
								rowGap="sm"
								sx={t => ({
									[t.fn.largerThan('sm')]: {
										maxWidth: 180,
									},
								})}
							>
								<Text>
									<Text weight="bold">Autor</Text>
									{notice.data.AddedBy.FirstName} {notice.data.AddedBy.LastName}
								</Text>

								<Text sx={{ flexShrink: 0 }}>
									<Text weight="bold">Data publikacji</Text>
									{notice.data.StartDate}
								</Text>

								<Text sx={{ flexShrink: 0 }}>
									<Text weight="bold">Data wygaśnięcia</Text>
									{notice.data.EndDate}
								</Text>
							</Flex>
						</Grid.Col>

						<Grid.Col span="auto">
							<Paper p="lg" sx={{ minHeight: '100%' }} withBorder>
								<Stack spacing="md">
									<Title inline order={2}>
										Treść
									</Title>
									<Text
										sx={{ whiteSpace: 'pre-wrap', a: { wordBreak: 'break-all' } }}
										dangerouslySetInnerHTML={{
											__html: AutoLinker.link(notice.data.Content, {
												newWindow: true,
												truncate: { location: 'smart' },
												sanitizeHtml: true,
											}),
										}}
									/>
								</Stack>
							</Paper>
						</Grid.Col>
					</Grid>
				</Stack>
			</Container>
		</>
	)
}

export default NoticePage
