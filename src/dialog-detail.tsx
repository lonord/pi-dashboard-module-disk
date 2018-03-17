import { SelectableArea, SubTitle } from '@lonord/pi-dashboard-components'
import * as React from 'react'
import styled from 'styled-components'
import { DevSpeed, DevUsage } from './declare'
import Item from './item'
import { combineDevItemsAll } from './util'

export interface DetailProps {
	selectedDevNames: string[]
	nameAlias: { [x: string]: string }
	speedData: DevSpeed[]
	usageData: DevUsage[]
	updateSelectedDevNames(selectedDevNames: string[])
}

export default class Detail extends React.Component<DetailProps, any> {

	onItemClick = (dev: string) => {
		const { selectedDevNames, updateSelectedDevNames } = this.props
		const names = [
			...(selectedDevNames || [])
		]
		if (names.indexOf(dev) !== -1) {
			names.splice(names.indexOf(dev), 1)
		} else {
			if (names.length >= 2) {
				names.splice(0, names.length - 1)
			}
			names.push(dev)
		}
		updateSelectedDevNames && updateSelectedDevNames(names)
	}

	render() {
		const { selectedDevNames, nameAlias, speedData, usageData } = this.props
		const items = combineDevItemsAll(speedData || [], usageData || [], nameAlias || {})
		return (
			<div>
				<SubTitle>选择磁盘</SubTitle>
				{items.map((item) => (
					<SelectableAreaWithSpace key={item.dev}
						isSelected={selectedDevNames && selectedDevNames.indexOf(item.dev) >= 0}
						onClick={() => this.onItemClick(item.dev)}>
						<Item {...item}/>
					</SelectableAreaWithSpace>
				))}
			</div>
		)
	}
}

const SelectableAreaWithSpace = styled(SelectableArea) `
	margin-bottom: 8px;
	padding: 8px;
`
