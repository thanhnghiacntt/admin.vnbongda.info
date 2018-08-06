//DungDh edit

import * as React from "react";

interface DatePickerProps {
  onChange?: Function,
  initDate?: Date,
  caption?: string,
  className?: string,
  dateformat?: string,
  isRequest?:boolean,
}

enum RegexString{
  dd = "(0[1-9]|[12]\\d|3[01])",
  mm = "(0[1-9]|1[0-2])",
  yyyy = "(19|20)\\d{2}"

}

export class DatePicker extends React.Component<DatePickerProps,any> {

  private inputElement: HTMLInputElement;
  private container: HTMLElement;
  private initDate: Date;
  private month: number; // [0-11]
  private year: number;
  private selectedDate: Date;
  private regexString:string;
  private defaultDateFormat = "yyyy/mm/dd";
  private days: Array<string> = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat','Sun'];
  private months: Array<string> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  initControl() {
    this.initDate = this.checkObjectDate(this.props.initDate) ? this.props.initDate : new Date();
    this.regexString = this.getRegexString();
    this.month = this.initDate.getMonth();
    this.year = this.initDate.getFullYear();
    this.selectedDate = new Date(this.initDate.getFullYear(), this.initDate.getMonth(), this.initDate.getDate());
    if (this.props.initDate || this.props.isRequest){
      this.inputElement.value = this.getFullDate(this.selectedDate.getDate());
    }else{
      this.inputElement.value = "";
    }

    this.container = document.createElement("div");
    this.container.classList.add("datepicker");
    this.container.classList.add("hide");
    this.inputElement.parentNode.insertBefore(this.container, this.inputElement.nextSibling);
    this.build();
    this.inputEventHandler();
    this.calendarClickEventHandler();
    this.outsideClickEventHandler();
  }

  public Close() {
    if (!this.container.classList.contains("hide"))
      this.container.classList.add("hide");
  }

  private build() {
    var d = new Date(this.year, this.month);
    this.month = d.getMonth();
    this.year = d.getFullYear();

    // Caption of calendar
    let table = '<table>'
        + '<caption><button class="prev"><-</button> <div style="display:inline-block; width: 60%">'
        + this.months[this.month] + ' ' + this.year
        + '</div> <button class="next">-></button> </caption>';
    +'<tr>';

    [].forEach.call(this.days, (day: string) => {
      table += '<th>' + day + '</th>';
    });
    table += '</tr><tr>';

    //generate empty tds  (days  not in the first week of this month)
    for (var i = 0; i < this.GetDayNumber(d); i++) {
      table += '<td></td>';
    }

    // generate td cell day
    while (d.getMonth() == this.month) {
      var tdClass = "";
      if (d.valueOf() < new Date(this.year, this.month, new Date().getDate()).valueOf()) tdClass = "class=''";
      if (d.valueOf() == this.selectedDate.valueOf()) {
        tdClass = "class='today'";
      }
      table += '<td ' + tdClass + '>' + d.getDate() + '</td>';

      if (this.GetDayNumber(d) % 7 == 6) {
        table += '</tr><tr>';
      }

      d.setDate(d.getDate() + 1);
    }
    // generate date
    if (this.GetDayNumber(d) != 0) {
      for (var i = this.GetDayNumber(d); i < 7; i++) {
        table += '<td></td>';
      }
    }

    table += '</tr></table>';
    this.container.innerHTML = table;
  }

  private GetDayNumber(date: Date) {
    var dayNumber = date.getDay();
    if (dayNumber == 0) dayNumber = 7;
    return dayNumber - 1
  }

  private inputEventHandler() {
    this.inputElement.addEventListener("click", (e: Event)=> {
      e.stopPropagation();
      //var top = this.inputElement.offsetTop;
      // var left = this.inputElement.offsetLeft;
      //var height = this.inputElement.offsetHeight;
      //this.container.style.top = (top + height) + "px";
      //this.container.style.left = left + "px";
      this.build();
      this.container.classList.remove("hide");
    });
  }

  private calendarClickEventHandler() {
    this.container.addEventListener("click", (e: Event)=> {
      e.stopPropagation();
      let target = (e.target || e.srcElement) as HTMLElement;
      if (target.tagName.toLowerCase() == "td" && parseInt(target.innerHTML)) {
        this.selectedDate = new Date(this.year, this.month, parseInt(target.innerHTML));
        this.inputElement.value = this.getFullDate(parseInt(target.innerHTML));
        if (this.props.onChange) {
          this.props.onChange(this.selectedDate);
        }
        this.Close();
      }
      if (target.classList.contains("next")) {
        this.month++;
        this.build();
      }
      if (target.classList.contains("prev")) {
        this.month--;
        this.build()
      }
    });
  }

  private outsideClickEventHandler() {
    document.addEventListener("click", ()=> {
      this.Close();
    });
  }

  //check object date is validation
  private checkObjectDate(date):boolean{
    let isValidation = false;
    if ( Object.prototype.toString.call(date) === "[object Date]" ) {
      // it is a date
      if ( isNaN( date.getTime() ) ) {  // d.valueOf() could also work
        isValidation = false;
      }
      else {
        isValidation = true;
      }
    }
    else {
      isValidation = false;
    }
    return isValidation;
  }

  // return full day when user click on control
  private getFullDate(date: number) {
    //return new Date(this.year, this.month, date).toISOString();
    let format = (this.props.dateformat && this.props.dateformat.length >0)?this.props.dateformat.toLocaleLowerCase():this.defaultDateFormat;
    let year = this.year;
    let month = this.month+1;
    return format.replace(/yyyy|mm|dd/g,function (x) {
      let value= "";
      switch (x){
        case "yyyy":
          value = year+"";
          break;
        case "mm":
          value = (month<10?'0':'') + month;
          break;
        case "dd":
          value = (date <10? '0':'')+date;
          break;
      }
      return value;
    });
  }

  // next props receive
  componentWillReceiveProps(nextProps) {
    if (nextProps && this.checkObjectDate(nextProps.initDate)) {
      this.initDate = nextProps.initDate ? nextProps.initDate : new Date();
      this.month = this.initDate.getMonth();
      this.year = this.initDate.getFullYear();
      this.selectedDate = new Date(this.initDate.getFullYear(), this.initDate.getMonth(), this.initDate.getDate());
    }
  }

  // get date in months
  daysInMonth(m, y) { // m is 0 indexed: 0-11
    switch (m) {
      case 2 :
        return (y % 4 == 0 && y % 100) || y % 400 == 0 ? 29 : 28;
      case 4 :
      case 6 :
      case 9 :
      case 11 :
        return 30;
      default :
        return 31
    }
  }

  // check valid date
  isValid(d, m, y) {
    return m > 0 && m <= 12 && d > 0 && d <= this.daysInMonth(m, y);
  }

  validateDateString(dateS) {
    if (!(new RegExp(this.regexString,'g').test(dateS))){
      return false;
    }
    let arr = this.getDayFromDateString(dateS);
    if (!this.isValid(arr[0],arr[1],arr[2])){
      return false;
    }
    return true;
  }

  //Get regex string for validating date string
  getRegexString(){
    let regex = new RegExp('/[/]/','g');
    let format = (this.props.dateformat?this.props.dateformat:this.defaultDateFormat).toLocaleLowerCase().replace(regex,"\\/");
    let value = "";
    let values = "^"+ format.replace(/yyyy|mm|dd/g,function (x) {
          return RegexString[x];
        }) +"$";
    return values;
  }

  /**
   * get date,month,year form dateString
   * and mapping with date format
   * return a array has length = 3; [0]:day; [1]:month; [2]:year
   */
  getDayFromDateString(value):number[]{
    let format = (this.props.dateformat?this.props.dateformat:this.defaultDateFormat).toLocaleLowerCase();
    let result:number[] = [];
    let inDD = format.indexOf("dd");
    let inMM = format.indexOf("mm");
    let inYYYY = format.indexOf("yyyy");
    if (inDD>=0 && inDD<value.length){
      result[0] = parseInt(value.substring(inDD,inDD+2));
    }

    if (inMM>=0 && inMM<value.length){
      result[1] = parseInt(value.substring(inMM,inMM+2));
    }

    if (inYYYY>=0 && inYYYY<value.length){
      result[2] = parseInt(value.substring(inYYYY,inYYYY+4));
    }
    return result;
  }

  /**
   * convert date string with new date format
   */
  convertDateToDateFormat(value,format){
    let lastFormat = this.props.dateformat?this.props.dateformat:this.defaultDateFormat;
    let result = format.replace(/yyyy|mm|dd/g,function (str) {
      let i= lastFormat.indexOf(str);
      let val = "";
      if (i >=0 && i<value.length){
        val = value.substring(i,i+str.length);
      }
      return val;
    });
    return result;
  }

  componentDidMount() {
    this.initControl();
  }


  onDateChange(valueS) {
    if (this.validateDateString(valueS)) {
      //mm/dd/yyyy is default date format in Date Object
      this.initDate = new Date(this.convertDateToDateFormat(valueS,"mm/dd/yyyy"));
      this.month = this.initDate.getMonth();
      this.year = this.initDate.getFullYear();
      this.selectedDate = this.initDate;
      if (!this.container.classList.contains("hide"))
        this.build();
      if (this.props.onChange) {
        {
          this.props.onChange(this.selectedDate)
        }
      }
    }
  }

  onBlur(e){
    let value = e.target['value'];
    let data;

    if (this.props.isRequest || (value && value.length)){
      data = this.selectedDate;
      e.target['value'] = this.getFullDate(this.selectedDate.getDate());
    }else{
      data = e.target['value'] = "";
    }

    if (this.props.onChange){
      this.props.onChange(data);
    }
  }
  render() {
    return (
        <div className={this.props.className?this.props.className: ""} style={{position: 'relative', zIndex: 2}}>
          <label>{this.props.caption}</label>
          <input
              className={this.props.className?this.props.className: ""}
              onChange={(e)=>{ this.onDateChange(e.target['value']) }}
              placeholder={this.props.dateformat}
              onBlur={(e)=>this.onBlur(e)}
              type="text"
              ref={(x) =>{this.inputElement = x;}}/>
        </div>
    );
  }
}