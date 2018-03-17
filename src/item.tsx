import { IndicatorButton, ProgressBar, SubTitle } from '@lonord/pi-dashboard-components'
import {
	FlexItemAdaptive,
	FlexItemFix,
	IconButton,
	withFlexAlignItemsCenter,
	withFlexHorizental
} from '@lonord/react-electron-components'
// tslint:disable-next-line:no-submodule-imports
import { IconButtonProps } from '@lonord/react-electron-components/lib/button/icon'
import * as React from 'react'
import styled from 'styled-components'
import { formatBytes, formatKiloBytes } from './util'

export interface ItemProps {
	dev: string
	name?: string
	read: number
	write: number
	tps: number
	total: number
	used: number
}

export default class Item extends React.Component<ItemProps, any> {
	render() {
		const { dev, name, read, write, tps, total, used } = this.props
		const displayName = name ? `${name}(${dev})` : dev
		return (
			<div>
				<SubTitle>{displayName}</SubTitle>
				<ProgressBar progress={total > 0 ? used * 100 / total : 0} />
				<SubTitleSmall>{formatKiloBytes(total - used) + ' 可用，共 ' + formatKiloBytes(total)}</SubTitleSmall>
				<SubTitleSmallSmall>
					<SmallIndicatorButton showColor={selectTPSIndicatorColor(tps)} />
					<span>TPS</span>
					<SmallNumAreaSpan>{tps < 0 ? '-' : tps}</SmallNumAreaSpan>
					<span>{' | '}</span>
					<NumAreaSpan>{formatBytes(read)}/s</NumAreaSpan>
					<span>{' | '}</span>
					<NumAreaSpan>{formatBytes(write)}/s</NumAreaSpan>
				</SubTitleSmallSmall>
			</div>
		)
	}
}

const SubTitleSmall = SubTitle.extend`
	margin-top: 4px;
	font-size: 12px;
	margin-bottom: 0;
`

const SubTitleSmallSmall = withFlexAlignItemsCenter(withFlexHorizental(SubTitleSmall.extend`
	margin-top: 2px;
	font-size: 10px;
`))

const NumAreaSpan = styled.span`
	display: inline-block;
	width: 50px;
	padding: 0 2px;
	text-align: right;
`

const SmallNumAreaSpan = styled.span`
	display: inline-block;
	width: 26px;
	padding: 0 2px;
	text-align: right;
`

const SmallIndicatorButton = styled(IndicatorButton) `
	font-size: 8px;
`

function selectTPSIndicatorColor(tps: number) {
	if (tps < 1) {
		return '#E0E0E0'
	}
	if (tps < 20) {
		return '#8BC34A'
	}
	return '#FF5722'
}
