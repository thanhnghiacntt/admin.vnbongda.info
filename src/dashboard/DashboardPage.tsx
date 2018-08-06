/**
 * Created by banhtieu on 8/29/2016.
 */

import * as React from 'react';
import {Helper} from "../utils/Helper";

/**
 * the dash board
 */
export default class Dashboard extends React.Component<{}, {}> {

  componentDidMount() {
    Helper.setPageTitle("Dashboard");
  }

  render() {
    return (
      <div className="ui blurring content-box">
      </div>
    );
  }
}