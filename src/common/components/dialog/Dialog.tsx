import * as React from "react";
import {AppEvent, postEvent, subscribe} from "../../../application/stores/AppStore";
import {Unsubscribe} from "redux";


/**
 * Component properties
 */
export interface DialogData {

	/**
	 * icon of the dialog
	 */
	icon?: string;

	/**
	 * value of the text box
	 */
	title?: string;

	/**
	 * the message to display
	 */
	message?: string;

	/**
	 * user click yes or no/cancel
	 */
	answer?: boolean
}

export enum DialogType {
	Alert, YesNo
}

/**
 * Show the text box for searching
 */
export class Dialog extends React.Component<any, DialogData> {

	unsubscribe: Unsubscribe

	state: DialogData = {
		message: "",
		title: "",
		icon: "archive icon"
	};
	/**
	 * the modal element
	 */
	public modalElement: HTMLElement;


	static show(title: string, message: string, type: DialogType = DialogType.Alert) {

		let data: DialogData = {
			title: title,
			message: message,
			icon: "info"
		}

		if (type == DialogType.Alert) {
			data.icon = "info"
		}
		else {
			data.icon = "archive"
		}

		postEvent(AppEvent.ShowDialog, data);

		return new Promise<Boolean>((accept) => {
			let unsubscribe = subscribe(async (state) => {
				if (state.event == AppEvent.HideDialog) {
					if (state.dialogData != null) {
						accept(state.dialogData.answer || false)
					}
					else {
						accept(false)
					}
					unsubscribe()
				}
			})
		});
	}

	/**
	 * show the confirmation dialog
	 */
	modal() {
		$(this.modalElement).modal({
			closable: false,
			onApprove: () => {
				postEvent(AppEvent.HideDialog, {answer: true})
			},
			onDeny: () => {
				postEvent(AppEvent.HideDialog, {answer: false})
			}
		}).modal("show");
	}

	/**
	 * Component did mount
	 */
	componentDidMount() {
		this.unsubscribe = subscribe(async (state) => {
			if (state.event != AppEvent.ShowDialog) {
				return
			}
			let data = state.dialogData as DialogData
			this.setState({
				title: data.title,
				message: data.message,
				icon: data.icon
			})
			this.modal()
		})
	}

	/**
	 * component receive next props
	 */
	componentWillReceiveProps(props) {
	}

	componentWillUnmount() {
		this.unsubscribe()
	}

	/**
	 * render the search box
	 */
	render() {
		return (
			<div className="ui small modal" ref={element => this.modalElement = element}>
				<div className="header">
					<i className={"icon " + this.state.icon}/>
					{this.state.title}
				</div>
				<div className="content">
					<div className="description">
						<p>{this.state.message}</p>
					</div>
				</div>
				{this.state.icon == "archive" ?
					<div className="actions">
						<div className="ui black deny button">
							Không
						</div>
						< div className="ui positive right labeled icon button">
							Có
							< i className="checkmark icon"/>
						</div>
					</div>
					: <div className="actions">
						< div className="ui positive right labeled icon button">
							OK
							< i className="checkmark icon"/>
						</div>
					</div>
				}
			</div>
		)
	}
}