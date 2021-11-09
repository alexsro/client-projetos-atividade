import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Activities from '../pages/Activities';
import Projects from '../pages/Projects';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/projects" component={Projects} />
    <Route path="/activities" component={Activities} />
  </Switch>
);

export default Routes;
