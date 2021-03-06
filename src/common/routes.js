import { Route } from 'react-router';
import React from 'react';
import App from './containers/App';
import LoginPage from './containers/LoginPage';

import Dashboard from './components/personal/Dashboard';
import HomePage from './components/Home';
import AboutPage from './components/About';
import error404 from './components/404';
import cookie from 'react-cookie';

function requireAuth() {
  if (cookie.load('token')) {
    return true;
  }
  window.location = '/login';
}

function unRequireAuth() {
  if (!cookie.load('token')) {
    return true;
  }
  window.location = '/home';
}


export default (
    <Route name="app" path="/" component={App}>
        <Route onEnter={requireAuth}>
            <Route path="home" component={HomePage}/>
            <Route path="dashboard" component={Dashboard} />
            <Route path="about" component={AboutPage} />
        </Route>
        <Route path="login" component={LoginPage} onEnter={unRequireAuth}/>
        <Route path="*" component={error404}/>
    </Route>
);
