import * as React from "react";
import { ColumnSetting } from "./ColumnSetting"
import { Button } from 'react-bootstrap';
import * as moment from 'moment';

export interface TRowProps {
    rowdata: any
    columnsSetting?: Array<ColumnSetting>
    handleFieldChange?: Function
    handleCellClick?: Function
    onAction?: Function
}

export enum Action {
    Detail = 1,
    Delete = 1
}

export class TRow extends React.Component<TRowProps, {}>{
    handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, name: string) => {
        let value = e.target.value
        this.props.handleFieldChange(name, value)
    }

    renderRowDatas = () => {
        let tds: Array<any> = []
        this.props.columnsSetting.forEach(element => {
            if (element.visible) {
                switch (element.type) {
                    case "select":
                        tds.push(
                            <td key={element.name}>
                                <select
                                    className="form-control"
                                    value={this.props.rowdata[element.name]}
                                    onChange={(e) => this.handleSelectChange(e, element.name)}>
                                    {
                                        element.selects.map((option) =>
                                            <option key={option.id} value={option.id}>{option.name}</option>
                                        )
                                    }
                                </select>
                            </td>)
                        break
                        case "date":
                        tds.push(
                            <td key={element.name}
                                onClick={(e) => this.props.handleCellClick(element.name)} >
                                {moment(this.props.rowdata[element.name]).format("DD/MM/YYYY")}
                            </td>
                        )
                        break
                        case "datetime":
                        tds.push(
                            <td key={element.name}
                                onClick={(e) => this.props.handleCellClick(element.name)} >
                                {moment(this.props.rowdata[element.name]).format("DD/MM/YYYY - HH:mm")}
                            </td>
                        )
                        break
                    default:
                        tds.push(
                            <td key={element.name}
                                onClick={(e) => this.props.handleCellClick(element.name)} >
                                {this.props.rowdata[element.name] && (typeof this.props.rowdata[element.name].name != "undefined") ? this.props.rowdata[element.name].name : this.props.rowdata[element.name]}
                            </td>
                        )
                        break
                }
            }
        });
        return tds
    }

    renderRowAction = () => {
        if (this.props.onAction) {
            return (
                <td className="table-action">
                    <Button bsSize="xsmall" bsStyle="info" onClick={(e) => this.props.onAction(Action.Detail)}><i className="fa fa-align-left" aria-hidden="true"></i>Detail</Button>
                </td>
            )
        }
        return

    }

    render() {

        return (
            <tr>
                {this.renderRowDatas()}
                {this.renderRowAction()}
            </tr>
        )
    }
}