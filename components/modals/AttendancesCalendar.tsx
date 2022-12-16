/* eslint-disable @typescript-eslint/no-empty-function */
import { Button, Indicator, SimpleGrid, Stack } from '@mantine/core'
import { Calendar } from '@mantine/dates'
import { useMediaQuery } from '@mantine/hooks'
import { ContextModalProps } from '@mantine/modals'
import dayjs from 'dayjs'
import { useState } from 'react'

export default function AttendancesCalendar({
	innerProps: { dates },
}: ContextModalProps<{ dates: Date[] }>) {
	const [month, setMonth] = useState(dates[dates.length - 1])
	const small = useMediaQuery('(max-width: 393px)', true)
	const smaller = useMediaQuery('(max-width: 337px)', true)

	return (
		<Stack>
			<Calendar
				size={small ? (smaller ? 'xs' : 'sm') : 'md'}
				mx="auto"
				value={new Date()}
				renderDay={date => (
					<Indicator
						size={small ? 8 : 10}
						color="red"
						offset={small ? 8 : 10}
						disabled={!dates.filter(d => !dayjs(date).diff(d, 'day')).length}
						styles={{
							indicator: {
								opacity: date.getMonth() === month.getMonth() ? 1 : 0.4,
							},
						}}
					>
						<div>{date.getDate()}</div>
					</Indicator>
				)}
				minDate={dayjs(dates[0]).startOf('month').toDate()}
				maxDate={dayjs(dates.at(-1)).endOf('month').toDate()}
				excludeDate={date => !dates.filter(d => d.getMonth() === date.getMonth())}
				allowLevelChange={false}
				onChange={date => date && setMonth(date)}
				month={month}
				onMonthChange={setMonth}
			/>
			<SimpleGrid
				cols={4}
				breakpoints={[
					{ maxWidth: 565, cols: 3 },
					{ maxWidth: 440, cols: 2 },
				]}
			>
				{dates.map((date, i) => (
					<Button
						key={i}
						fullWidth
						variant={date.getMonth() === month.getMonth() ? 'light' : 'subtle'}
						onClick={() => setMonth(date)}
					>
						{dayjs(date).format('DD-MM-YYYY')}
					</Button>
				))}
			</SimpleGrid>
		</Stack>
	)
}
