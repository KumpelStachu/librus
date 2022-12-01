import Head from 'next/head'

type Props = {
	title: string[]
}

export default function HeadTitle({ title }: Props) {
	return (
		<Head>
			<title>{[...title, 'Librus'].join(' • ')}</title>
		</Head>
	)
}
