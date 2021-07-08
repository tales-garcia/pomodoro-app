import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Timer from './pages/Timer';

const Routes: React.FC = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path="/" exact component={Timer} />
        <Route exact path="/dashboard" component={Dashboard} />
      </Switch>
    </HashRouter>
  );
}

export default Routes;