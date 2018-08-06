import * as React from "react";
import {AppEvent, postEvent, subscribe} from "../../../application/stores/AppStore";
import {Unsubscribe} from "redux";

/**
 * Component properties
 */
interface State {

	/**
	 * display is loading
	 */
	spin: boolean;
}


/**
 * the loader - showing a "loading" status
 */
export class Spinner extends React.Component<any, State> {

	state = {
		spin: false
	}

	unsubscribe: Unsubscribe
	/**
	 * Component did mount
	 */
	componentDidMount() {
		this.unsubscribe = subscribe(async (state) => {
			if (state.event == AppEvent.ShowSpinner) {
				this.setState({spin: state.spin})
			}
		})
	}

	static show(spin: boolean){
		postEvent(AppEvent.ShowSpinner, spin);
	}

	componentWillUnmount(){
		this.unsubscribe()
	}

	/**
	 * render the loader
	 */
	render() {
		return (
			<div className={this.state.spin ? "ui active inverted dimmer" : "ui dimmer"} style={{position:"fixed"}}>
				<div className="ui large loader"/>
			</div>
		)
	}
}