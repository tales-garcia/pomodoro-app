import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Timer from './pages/Timer';

const Routes: React.FC = () => {
  return (
    <HashRouter>
        <Switch>
            <Route path="/" exact component={Timer} />
            <Route exact path="/dashboard" render={() => <div>Dashboard</div>} />
        </Switch>
    </HashRouter>
  );
}

export default Routes;