import * as React from "react";
import { Table } from "react-bootstrap"
import { THead } from "./THead"
import { TBody } from "./TBody"
import { ColumnSetting } from "./ColumnSetting"
import { AppStore } from '../../redux/AppStore';

export interface CommonTableProps {
    data: Array<any>
    keyField?: string
    fieldsNamme?: Array<string>
    columnsSetting?: Array<ColumnSetting>
    handleSelectChange?: Function
    handleFieldChange?: Function
    handleSearch?: Function
    handleCellClick?: Function
    onAction?: Function
}

export class CommonTable extends React.Component<CommonTableProps, any> {
    strings: any
    constructor(props: CommonTableProps) {
        super(props)
        this.strings = AppStore.getState().strings
    }

    generateColums() {
        let hasData = this.props.data && this.props.data[0]
        let columnsSetting: Array<ColumnSetting> = []
        if (hasData && !this.props.columnsSetting) {
            for (let field in this.props.data[0]) {
                let setting = new ColumnSetting(field)
                columnsSetting.push(setting)
            }
        }
        else {
            columnsSetting = this.props.columnsSetting
        }
        this.state = { hasData: hasData, columnsSetting: columnsSetting }
    }

    handleFieldChange = (id: any, fieldName: string, value: any) => {
        if (this.props.handleFieldChange) {
            this.props.handleFieldChange(id, fieldName, value)
        }
    }

    handleSearch = (fieldName: string, value: any) => {
        if (this.props.handleSearch) {
            this.props.handleSearch(fieldName, value)
        }
    }

    handleCellClick = (field: any, key: any) => {
        if (this.props.handleCellClick) {
            this.props.handleCellClick(field, key)
        }
    }


    render() {
        this.generateColums()
        let hasData = this.props.data && this.props.data[0]
        return (
            <Table responsive striped bordered condensed hover className="form-group-sm common-table">
                <THead columnsSetting={this.state.columnsSetting}
                    hasAction={this.props.onAction != null} />
                <TBody keyField={this.props.keyField}
                    data={this.props.data}
                    columnsSetting={this.state.columnsSetting}
                    handleFieldChange={this.handleFieldChange}
                    handleSearch={this.handleSearch}
                    handleCellClick={this.handleCellClick}
                    onAction={this.props.onAction}
                    hasData={this.state.hasData} />
            </Table>
        )
    }
}