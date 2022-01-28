import React from 'react';
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom';
import Home from './components/Home';
import CreateEvent from './components/CreateEvent';
import EditEvent from './components/EditEvent';
import CreateComment from './components/CreateComment';
import Comment from './components/Comment';
import Login from './components/Login';
import Register from './components/Register';
import Event from './components/Event';
import EditCommunity from './components/EditCommunity';
import PasswordEmail from './components/PasswordEmail';
import PasswordReset from './components/PasswordReset';
import NotFound from './components/NotFound'
// User is LoggedIn
import PrivateRoute from './PrivateRoute'
import CreateCommunity from "./components/CreateCommunity";
import Community from "./components/Community";
const Main = props => (
    <Switch>
        <PrivateRoute exact path='/' component={Home}/>
        <PrivateRoute path='/community/create' component={CreateCommunity}/>
        <PrivateRoute path='/community/:id/:title' component={Event}/>
        <PrivateRoute path='/community' component={Community}/>
        <Route path='/login' component={Login}/>
        <Route path='/register' component={Register}/>
        <Route path='/password/email' component={PasswordEmail}/>
        <Route path='/password/reset/:token' component={PasswordReset}/>
        <PrivateRoute path='/event/create' component={CreateEvent}/>
        <PrivateRoute path='/event/:id' component={Comment}/>
        <PrivateRoute path='/comment/create/:id' component={CreateComment}/>
        <PrivateRoute path='/editEvent/:id' component={EditEvent}/>
        <PrivateRoute path='/editCommunity/:id' component={EditCommunity}/>
        {/*Page Not Found*/}
        {/*<Route component={NotFound} path='/not-found'/>*/}
    </Switch>
);
export default Main;
