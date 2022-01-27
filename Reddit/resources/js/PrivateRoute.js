import React from 'react';
import {Redirect, Route, withRouter} from 'react-router-dom';
// 3.3
const PrivateRoute = ({ component: Component, path, ...rest }) => (
    <Route path={path}
           {...rest}
           render={props => user ? (
               <Component {...props} />) : (<Redirect to={{
                   pathname: "/login",
                   state: {
                       prevLocation: path,
                       error: "You need to login first!",
                   },
               }}
               />
           )
           }
    />);
export default withRouter(PrivateRoute);
