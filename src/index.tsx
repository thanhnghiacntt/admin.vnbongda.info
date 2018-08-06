import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {AuthorizeRoute} from "./utils/AuthorizeRoute"
import App from "./application/App";
import LoginPage from "./controller/users/LoginPage";
import NotFound from "./application/NotFound";
import ForgotPassword from "./controller/users/ForgotPassword";
import ResetPassword from "./controller/users/ResetPasswords";
import Dashboard from "./dashboard/DashboardPage";
import AddUser from "./controller/users/AddUser";
import Users from "./controller/users/Users";
import Categories from "./controller/category/Categories";
import {EditCategory} from "./controller/category/EditCategory";
import UserProfile from "./controller/users/UserProfile";

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/forgotpassword" component={ForgotPassword} />
      <Route exact path="/resetpassword/:token" component={ResetPassword}/>
      <App>
        <Switch>
          <AuthorizeRoute exact path="/" component={Dashboard} />
          <AuthorizeRoute exact path="/dashboard" component={Dashboard}/>
          <AuthorizeRoute exact path="/profile" component={UserProfile}/>
          <AuthorizeRoute exact path="/users" component={Users}/>
          <AuthorizeRoute exact path="/users/edit/:userId" component={AddUser}/>
          <AuthorizeRoute exact path="/users/edit" component={AddUser}/>
          <AuthorizeRoute exact path="/category" component={Categories}/>
          <AuthorizeRoute exact path="/category/edit" component={EditCategory}/>
          <AuthorizeRoute exact path="/category/edit/:catId" component={EditCategory}/>
          <AuthorizeRoute component={NotFound} />
        </Switch>
      </App>
    </Switch>
  </Router>,
  document.getElementById('root')
);

