import * as React from "react";
import { AppStore } from "../../redux/AppStore";
import { CommonTable } from '.././CommonTable/CommonTable';
import { ColumnSetting } from '.././CommonTable/ColumnSetting';
import {User} from "../../models/User";

interface UserTableProps {
    data: Array<User>
    handleCellClick?: Function
    handleSearch?: Function
    onAction?: Function
}

export class UserTable extends React.Component<UserTableProps, any> {
    strings = AppStore.getState().strings
    settings: Array<ColumnSetting> = [
        new ColumnSetting("user_id", "table_id", true, true, 1),
        new ColumnSetting("name", "table_name", true, true, 3),
        new ColumnSetting("email", "table_email", true, true, 3),
        new ColumnSetting("role", "table_role", true, true, 3),
        new ColumnSetting("created_at", "table_created_at", true, true, 3, "date"),
        new ColumnSetting("update_at", "table_update_at", true, true, 3, "date"),
    ]

    render() {
        return (
            <div>
                <CommonTable keyField={"user_id"}
                    columnsSetting={this.settings} data={this.props.data}
                    handleCellClick={this.props.handleCellClick}
                    handleSearch={this.props.handleSearch}
                    onAction={this.props.onAction}/>
            </div>
        )
    }
}