import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './components/Home'
import PersonDetails from './components/PersonDetails'


function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/sheet/:id' component={PersonDetails} />
        </Switch>

      </div>
    </Router>
  );
}

export default App;
