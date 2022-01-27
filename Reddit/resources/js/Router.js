import React from 'react';
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import PasswordEmail from './components/PasswordEmail';
import PasswordReset from './components/PasswordReset';
import CreateCommunity from "./components/CreateCommunity";
const Main = props => (
    <Switch>
        <PrivateRoute exact path='/' component={Home}/>
        <PrivateRoute path='/community/create' component={CreateCommunity}/>
        <Route path='/login' component={Login}/>
        <Route path='/register' component={Register}/>
        <Route path='/password/email' component={PasswordEmail}/>
        <Route path='/password/reset/:token' component={PasswordReset}/>
    </Switch>
);
export default Main;
