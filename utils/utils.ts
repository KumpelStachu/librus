/** @link https://stackoverflow.com/a/62765924 */
export const groupBy = <T, K extends keyof never>(arr: T[], key: (i: T) => K) =>
	arr.reduce(
		(groups, item) => ((groups[key(item)] ||= []).push(item), groups),
		{} as Record<K, T[]>
	)
