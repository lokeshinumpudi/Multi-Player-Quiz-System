import React from "react";

import {Provider} from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Store from "./store/AppStore";

// All our components
import Home from "./components/Home";
import WaitForPlayers from "./components/WaitForPlayers";
import GameCenter from "./components/GameCenter";
const App = () => (
  <Provider store={Store}>
  <Router>
    <div >
      {/*<ul>
        <li><link to="/" />Home</li>
        <li><link to="/about" />About</li>
        <li><link to="/topics/1" />Topics</li>
      </ul>*/}

      <Route exact path="/" component={Home} />
      <Route exact path="/MatchMaking" component={WaitForPlayers} />
      <Route exact path="/Game_Center" component={GameCenter} />

     <div className="footer">
       Made as an experiment to learn React.js, Redux and Firebase by
        <a target="blank" href="https://twitter.com/lokeshinumpudi"> Lokesh Inumpudi. </a> 
        Source at
        <a target="blank" href="https://github.com/lokeshinumpudi/Multi-Player-Quiz-System"> Github</a> 
       
       </div>
    </div>
  </Router>
  </Provider>
);

export default App;
