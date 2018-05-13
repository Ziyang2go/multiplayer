import React, { Component } from 'react';
import logo from './logo.svg';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Room from './Room';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="App-intro">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/room/:id" component={Room} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
