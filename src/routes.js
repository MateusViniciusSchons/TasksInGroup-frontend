import React from 'react'

import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import CreateTask from './pages/CreateTask'
import Details from './pages/Details'

import isAuthenticated from './services/auth'

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        isAuthenticated() ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        )
      }
    />
  );

export default function Routes() {
    return(
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={Login} />
                <PrivateRoute path='/home' exact component={Home} />
                <PrivateRoute path='/tasks/new' exact component={CreateTask} />
                <PrivateRoute path='/tasks/:id' exact component={Details} />
            </Switch>
        </BrowserRouter>
    );
}