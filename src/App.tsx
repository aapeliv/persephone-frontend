import * as React from 'react';
import './App.css';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Corpus from './components/Corpus';
import Index from './components/Index';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <h1>Persephone frontend</h1>
        <BrowserRouter>
          <Switch>
            <Route exact={true} path="/corpus/" component={Corpus} />
            <Route exact={true} path="/" component={Index} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
