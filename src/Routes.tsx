import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Timer from './pages/Timer';

const Routes: React.FC = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path="/timer" exact component={Timer} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/settings" component={Settings} />
      </Switch>
    </HashRouter>
  );
}

export default Routes;