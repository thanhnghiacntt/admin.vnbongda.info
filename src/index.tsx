import * as React from "react";
import * as ReactDOM from "react-dom";

import {HashRouter as Router, Route, Switch, Redirect, HashRouter} from 'react-router-dom';

import {Unsubscribe} from "redux"
import {AppEvent, AppStore, Language} from './redux/AppStore';
import {AuthorizeRoute} from "./helpers/AuthorizeRoute"
import {NotFoundComponent} from "./containers/NotFoundComponent";
import {LoginComponent} from "./containers/LoginComponent";
import {Layout} from "./containers/Layout";
import {Product} from "./controllers/Product";
import {Solution} from "./controllers/Solution";
import {Document} from "./controllers/Document";
import {Company} from "./controllers/Company";
import {Price} from "./controllers/Price";
import {SignIn} from "./controllers/SignIn";
import NotFound from "./controllers/NotFound";
import {Cookie} from "./helpers/Cookie";
import {Home} from "./controllers/Home";
import {Setting} from "./controllers/Setting";
import {SignUp} from "./controllers/SignUp";
import {UserService} from "./services/UserService";
import {SignKey} from "./controllers/SignKey";

class AppRouter extends React.Component {

  unsubscribe: Unsubscribe;

  componentWillMount(){
    AppStore.postEvent(AppEvent.initialize, Cookie.get("language") || Language.en);
  }

  render() {
    return (
      <Router>
        <Layout>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/product" component={Product} />
            <Route exact path="/solution" component={Solution}/>
            <Route exact path="/document" component={Document}/>
            <Route exact path="/company" component={Company}/>
            <Route exact path="/price" component={Price}/>
            <Route exact path="/signin" component={SignIn}/>
            <AuthorizeRoute exact path="/user/setting" component={Setting}/>
            <AuthorizeRoute exact path="/user/keys" component={SignKey}/>
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Router>
    )
  }

  componentDidMount() {
    this.unsubscribe = AppStore.subscribe((state) => {
      //refresh app
      switch (state.event) {
        case AppEvent.changeLanguague:
        case AppEvent.redirect:
        case AppEvent.login:
          this.setState({});
          break;
        case AppEvent.logout:
          UserService.shared.logout();
          this.setState({});
          break;
      }
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }
}


ReactDOM.render(
  <AppRouter/>,
  document.getElementById("root")
);