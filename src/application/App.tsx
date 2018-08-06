import * as React from 'react';
import NavigationBar from './NavigationBar'
import AppMenu from '../menu/AppMenu'
import {Redirect} from "react-router";
import {Unsubscribe} from "redux";
import {AppEvent, subscribe} from "./stores/AppStore";
import {Dialog} from "../common/components/dialog/Dialog";
import {Loader} from "../common/components/loader/Loader";
import {Spinner} from "../common/components/loader/Spinner";


/**
 * the app container
 */
export default class App extends React.Component<{}, {collapsed: Boolean}> {

  unsubscribe: Unsubscribe = null
  shouldRedirect = false
  redirectTo = null

  componentDidMount(){
    this.unsubscribe = subscribe(state => {
      if (state.event == AppEvent.Redirect){
        this.shouldRedirect = true
        this.redirectTo = state.redirectTo
        this.setState({});
      }
    })
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  /**
   * render the components
   * @returns {XML}
   */
  render() {

    if (this.shouldRedirect && this.redirectTo != null){
      this.shouldRedirect = false
      let redirectTo = this.redirectTo
      this.redirectTo = null
      return <Redirect to={redirectTo} />
    }

    return (
      <div>
        <Dialog />
        <Spinner/>
        <NavigationBar/>
        <div className="app-container">
          <AppMenu />
          <div className="app-content">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
