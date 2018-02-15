import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import UserPage from './app/userpage.jsx';
import StreamPage from './app/streampage.jsx';
import AdminPanel from './app/adminpanel.jsx';

console.log("hi");

render(
  <Router>
    <Switch>
      <Route exact path="/" component={UserPage}/>
      <Route path="/stream_page_supernovamaniac" component={StreamPage}/>
      <Route path="/admin_panel_supernovamaniac" component={AdminPanel}/>
    </Switch>
  </Router>,
  document.getElementById('app')
)
