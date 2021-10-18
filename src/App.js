import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './pages/Home';
import Map from './pages/Map';
import Table from './components/Table';

function App() {
  return (
    <Router>
      <Route path="/" exact component={Home}></Route>
      <Route path="/map" exact component={Map}></Route>
    </Router>
  );
}

export default App;
