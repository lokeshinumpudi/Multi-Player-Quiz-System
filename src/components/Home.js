import React, { Component } from "react";
import * as firebase from "firebase";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Store from "../store/AppStore";


// Material Components
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


const styles = {
  underlineStyle: {
    borderColor: "#6200EA",
  },
  floatingLabelFocusStyle: {
    color: "#6200EA",
  },
}
const config = {
  apiKey: "AIzaSyDtt-apAmBvAHRugPwkXvYnsiNLTiMg684",
  authDomain: "multiplayer-quiz-38a93.firebaseapp.com",
  databaseURL: "https://multiplayer-quiz-38a93.firebaseio.com",
  projectId: "multiplayer-quiz-38a93",
  storageBucket: "multiplayer-quiz-38a93.appspot.com",
  messagingSenderId: "266203985266"
};

firebase.initializeApp(config);

let db = firebase.database();
let populateLobbyUrl = "https://us-central1-multiplayer-quiz-38a93.cloudfunctions.net/populateLobby?amazing=1&";

const max_lobby_players = 3;
const max_random_questions = 5;


function addPlayerToLobby(user, lobby) {
  db.ref("GamesLobby/" + lobby).child("players").child(user.userId).set(user);
}
function createNewLobby(user, params) {
  let lobbyName = "Game:" + Date.now();
  addPlayerToLobby(user, lobbyName);
  //dispatch the lobby name
  Store.dispatch({ type: "CHANGE_LOBBY", key: lobbyName });
  // Make a call to cloud function which populates the GamesLobby with questions
  let finalUrl = populateLobbyUrl + "id=" + lobbyName + "&no=" + max_random_questions;

  console.log(finalUrl);
  // no-cors request to cloud function
  fetch(finalUrl, { mode: "no-cors" })
    .then(res => {
      return res.json();
    })
    .then(data => {
      console.log(data);
      if (data.status === "success") {
        console.log("Questions populated in Lobby:" + lobbyName);
      }
    });
} //createNewLobby

let findGameLobby = (user, params) => {
  let prom = new Promise((resolve, reject) => {
    let lobbyFound = false;
    db.ref("GamesLobby").once("value", snap => {
      let lobies = snap.val();

      // first player ever
      if (lobies == null) {
        createNewLobby(user, params);
        lobbyFound = true;
      } else {
        //find a lobby for our player
        let allLobbies = Object.keys(lobies);
        allLobbies.forEach(key => {
          let eachlobby = lobies[key];

          if (eachlobby.players === undefined) return;

          let noOfPlayers = Object.keys(eachlobby.players).length;
          // add player to lobby if not full
          if (noOfPlayers <= max_lobby_players) {
            if (noOfPlayers === max_lobby_players) {
              //this lobby is full so check next lobby
              return;
            }

            // if all lobbies are full this creates a new lobby and adds this player;
            addPlayerToLobby(user, key);

            //dispatch the lobby name
            Store.dispatch({ type: "CHANGE_LOBBY", key: key });

            lobbyFound = true;
          }
        }); //allLobies.loop
      } //else

      if (!lobbyFound) {
        createNewLobby(user);
        lobbyFound = true;
      }

      resolve(lobbyFound);
    }); //db call
  }); //our promise

  return prom;
};

let CustomRedirect = props => {
  if (props.lobby.lobby_found) {
    // console.log("omg");
    return <Redirect to="/MatchMaking" />;
  }

  return <div />;
};

class Home extends Component {
  findLobby = e => {
    e.preventDefault();
    let username = this.refs.username.input.value;
    let userId = username + Date.now();
    let user = {
      username,
      userId: userId
    };

    this.props.setUser(user);
    findGameLobby(user, this.props.match.params).then(val => {
      Store.dispatch({ type: "LOBBY_FOUND" });
    });
  };

  componentDidMount() {
    // console.log(this.refs.username.input.value);
    // only for testing
    this.refs.username.input.value = "Player" + Math.floor(Math.random() * 20);
    this.refs.username.focus();
    //   this.refs.form.submit();
  }
  render() {
    // console.log(this.props.match.params);
    return (
      <div className="Home">


        <div className="jumbotron">
          <h1 className="display-3">Welcome to the Quiz Game!</h1>
          <p className="lead">Compete with other players in real time with similar tastes as you.Enter your name & wait for others to join for a game together.</p>
           </div>

          <div className="card text-white bg-success mb-3">
            <form ref="form" onSubmit={this.findLobby}>
              {/*<input ref="username" type="text" placeholder="Username" />*/}
              <TextField ref="username" floatingLabelFocusStyle={styles.floatingLabelFocusStyle} underlineFocusStyle={styles.underlineStyle} floatingLabelText="Enter Username" floatingLabelFixed={true} />
              {/*<input type="submit" value="Play" />*/}
              <RaisedButton type="submit" backgroundColor="#6200EA" labelColor="#fff" label="Play" />
            </form>
          </div>

          <CustomRedirect lobby={this.props.store} />
        </div>
        );
      }
    }
    
function mapState(store) {
  return {
          store
        };
      }
      
function mapDispatch(dispatch) {
  return {
          setUser: user => {
          dispatch({ type: "SET_USER", user });
        }
      };
    }
    export default connect(mapState, mapDispatch)(Home);
