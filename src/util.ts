import { find, intersection } from 'lodash'
import { DevSpeed, DevUsage } from './declare'
import { ItemProps } from './item'

function getFirstTwoItems<T>(list: T[]): T[] {
	if (!list || list.length === 0) {
		return []
	}
	if (list.length === 1) {
		return [
			list[0]
		]
	}
	return [
		list[0],
		list[1]
	]
}

function generateItemPropsList(displayDevs: string[], speedData: DevSpeed[], usageData: DevUsage[],
	alias: { [x: string]: string }) {
	const items: ItemProps[] = []
	for (const devName of displayDevs) {
		const t: ItemProps = {
			dev: devName,
			name: alias[devName],
			tps: -1,
			read: -1,
			write: -1,
			used: -1,
			total: -1
		}
		const speedItem = find(speedData, (s) => s.dev === devName)
		if (speedItem) {
			t.tps = speedItem.tps
			t.read = speedItem.read
			t.write = speedItem.write
		}
		const usageItem = find(usageData, (u) => u.dev === devName)
		if (usageItem) {
			t.used = usageItem.used
			t.total = usageItem.total
		}
		items.push(t)
	}
	return items
}

export function combineDevItems(selectedDevNames: string[], speedData: DevSpeed[], usageData: DevUsage[],
	alias: { [x: string]: string }) {
	const displayDevs = getFirstTwoItems(selectedDevNames)
	if (displayDevs.length === 0) {
		return []
	}
	return generateItemPropsList(displayDevs, speedData, usageData, alias)
}

export function combineDevItemsAll(speedData: DevSpeed[], usageData: DevUsage[], alias: { [x: string]: string }) {
	const speedDevNames = speedData.map((speed) => speed.dev)
	const usageDevNames = usageData.map((usage) => usage.dev)
	const devNames = intersection(speedDevNames, usageDevNames)
	return generateItemPropsList(devNames, speedData, usageData, alias)
}

export function formatBytes(n: number) {
	if (n < 0) {
		return '- KB'
	}
	n = n / 1024
	if (n < 1024) {
		return `${Math.floor(n)} KB`
	}
	n = n / 1024
	if (n < 1024) {
		return `${formatNumber(n)} MB`
	}
	n = n / 1024
	return `${formatNumber(n)} GB`
}

export function formatKiloBytes(n: number) {
	if (n < 0) {
		return '- KB'
	}
	if (n < 1024) {
		return `${Math.floor(n)} KB`
	}
	n = n / 1024
	if (n < 1024) {
		return `${Math.floor(n)} MB`
	}
	n = n / 1024
	if (n < 1024) {
		return `${formatNumber(n)} GB`
	}
	n = n / 1024
	return `${formatNumber(n)} TB`
}

function formatNumber(n: number) {
	let s: string
	if (n < 10) {
		s = n + ''
		if (s.indexOf('.') >= 0) {
			s = s.substr(0, s.indexOf('.') + 2)
		}
	} else {
		s = Math.floor(n) + ''
	}
	return s
}
