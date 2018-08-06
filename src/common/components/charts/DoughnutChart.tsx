import {Doughnut} from 'react-chartjs'
import * as React from 'react'
interface DoughnutChartProps {
  data: CircularChartData[],
  options?: PieChartOptions,
  width?: number,
  height?: number,
  isPercentView?: boolean
}
export class DoughnutChart extends React.Component<DoughnutChartProps,{}> {
  /**
   * compare two items
   * @param a
   * @param b
   * @returns {number}
   */
  compare(a: CircularChartData, b: CircularChartData) {
    let num1 = parseFloat(a.value + "");
    let num2 = parseFloat(b.value + "");
    if (num1 < num2) {
      return 1;
    }
    if (num1 > num2) {
      return -1;
    }
    // a must be equal to b
    return 0;
  }

  /**
   * render view
   * @returns {any}
   */
  render() {
    let data = this.props.data.sort(this.compare) || [];
    return (
      <div style={{padding: "10px"}}>
        <Doughnut
          data={ data || []}
          options={{tooltipFillColor: 'rgb(25, 165, 206)'}}
          width={this.props.width || 300}
          height={this.props.height || 150}/>
        <div className="ui list">
          {
            data.map((x, index)=> {
              return (
                <div className="item" key={(x.color||"") + index}>
                  <i className="icon" style={{background: x.color}}/>
                  <div className="content">
                    {
                      x.label
                    }
                    <span style={{color: x.color}}>
                    {
                      " (" + x.value + (this.props.isPercentView ? "%" : "") + ")"
                    }
                    </span>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>);
  }
}