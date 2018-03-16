import { FullSizeWrap, Title, withSSEClient } from '@lonord/pi-dashboard-components'
import { Dialog } from '@lonord/react-electron-components'
import * as React from 'react'
import styled from 'styled-components'
import { name as displayName } from './index'

interface MainPropsMap {
	selectedDevNames: string[]
	rpcBaseUrl: string
	nameAlias: { [x: string]: string }
}

interface MainProps extends MainPropsMap {
	speedData: Array<{ dev: string, tps: number, read: number, write: number }>
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

	render() {
		const { rpcBaseUrl, nameAlias, speedData } = this.props
		const { isDetailOpen } = this.state
		const diskSpeedList = speedData || []
		const alias = nameAlias || {}
		return (
			<FullSizeWrap onClick={this.openDetail}>
				<Title borderColor="#757575">{displayName}</Title>
				123
				<Dialog isOpen={isDetailOpen} onClose={this.closeDetail} title={displayName}>
					123
				</Dialog>
			</FullSizeWrap>
		)
	}
}

export default withSSEClient(Main, 'disk-iostat', () => ({ interval: 5000 }), 'speedData')
