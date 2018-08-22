import * as React from "react";
import * as ReactDOM from "react-dom";

import {HashRouter as Router, Route, Switch, Redirect, HashRouter} from 'react-router-dom';

import {Unsubscribe} from "redux"
import {AppEvent, AppStore, Language} from './redux/AppStore';
import {AuthorizeRoute} from "./helpers/AuthorizeRoute"
import {Layout} from "./containers/Layout";
import {Login} from "./controllers/Login";
import {Cookie} from "./helpers/Cookie";
import {Home} from "./controllers/Home";
import {Setting} from "./controllers/Setting";
import {UserService} from "./services/UserService";
import {Post} from "./controllers/Post";
import {Category} from "./controllers/Category";
import {AdminGallery} from "./controllers/AdminGallery";
import {NotFound} from "./controllers/NotFound";
import {AdminPost} from "./controllers/AdminPost";
import {AdminCategory} from "./controllers/AdminCategory";
import {Authentication} from "./helpers/Authentication";

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
            <Route exact path="/post" component={Post} />
            <Route exact path="/category" component={Category}/>
            <Route exact path="/login" component={Login}/>
            <AuthorizeRoute exact path="/user/gallery" component={AdminGallery}/>
            <AuthorizeRoute exact path="/user/post" component={AdminPost}/>
            <AuthorizeRoute exact path="/user/category" component={AdminCategory}/>
            <AuthorizeRoute exact path="/user/setting" component={Setting}/>
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
          Authentication.logout();
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