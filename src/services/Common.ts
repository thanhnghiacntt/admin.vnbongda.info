import * as moment from "moment"

export class Common {

    static dateFormart(date: any): string {
        let mdate = moment(date)
        if (mdate.isValid) {
            return mdate.format("DD/MM/YYYY")
        }
        return
    }
}