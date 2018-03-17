import { FullSizeWrap, LoadingText, Title, withHTTPClient, withSSEClient } from '@lonord/pi-dashboard-components'
import { Dialog, FlexItemAdaptive, withFlexVertical } from '@lonord/react-electron-components'
import * as React from 'react'
import styled from 'styled-components'
import { DevSpeed, DevUsage } from './declare'
import Detail from './dialog-detail'
import { name as displayName } from './index'
import Item from './item'
import { combineDevItems } from './util'

interface MainPropsMap {
	selectedDevNames: string[]
	rpcBaseUrl: string
	nameAlias: { [x: string]: string }
}

interface MainProps extends MainPropsMap {
	speedData: DevSpeed[]
	usageData: DevUsage[]
	updateProps: <K extends keyof MainPropsMap>(props: Pick<MainPropsMap, K>) => void
}

interface MainState {
	isDetailOpen: boolean
}

class Main extends React.Component<MainProps, MainState> {

	state: MainState = {
		isDetailOpen: false
	}

	openDetail = () => {
		this.setState({
			isDetailOpen: true
		})
	}

	closeDetail = () => {
		this.setState({
			isDetailOpen: false
		})
	}

	updateSelectedDevNames = (devNames: string[]) => {
		this.props.updateProps({
			selectedDevNames: devNames
		})
	}

	render() {
		const { rpcBaseUrl, nameAlias, speedData, usageData, selectedDevNames } = this.props
		const { isDetailOpen } = this.state
		const items = combineDevItems(selectedDevNames, speedData || [], usageData || [], nameAlias || {})
		return (
			<Wrap onClick={this.openDetail}>
				<Title borderColor="#757575">{displayName}</Title>
				<ContentWrap>
					{items.map((item) => (
						<ContentItem key={item.dev}>
							<Item {...item}/>
						</ContentItem>
					))}
					{items.length === 0
						? <LoadingText>请选择磁盘</LoadingText>
						: null}
				</ContentWrap>
				<Dialog isOpen={isDetailOpen} onClose={this.closeDetail} title={displayName}>
					<Detail
						selectedDevNames={selectedDevNames}
						speedData={speedData}
						usageData={usageData}
						nameAlias={nameAlias}
						updateSelectedDevNames={this.updateSelectedDevNames}/>
				</Dialog>
			</Wrap>
		)
	}
}

const Wrap = withFlexVertical(FullSizeWrap)

const ContentWrap = withFlexVertical(FlexItemAdaptive.extend`
	justify-content: space-around;
`)

const ContentItem = styled.div`
	padding: 0 4px;
`

export default withHTTPClient(
	withSSEClient(
		Main,
		'disk-iostat',
		() => ({ interval: 5000 }),
		'speedData'),
	'disk-usage',
	() => null,
	10000,
	'usageData'
)
