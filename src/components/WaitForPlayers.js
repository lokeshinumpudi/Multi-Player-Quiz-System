import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import * as firebase from "firebase";
import "./wait.css";
const db = firebase.database();

// Material components
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import LinearProgress from 'material-ui/LinearProgress';
import Chip from "material-ui/Chip";
import SvgIconFace from "material-ui/svg-icons/action/face";
import { blue300, brown100 } from "material-ui/styles/colors";

const styles = {
  chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  divider:{
    marginTop: 10,
    marginBottom:5,
    backgroundColor:'#e2e1e0',
    padding:'0.6px'
  }
};
// configs
let calledOnce = false;
let max_players = 3;
// utils
// sets lobby status
let setLobbyStatus = (status, lobbykey) => {
  db.ref("GamesLobby/" + lobbykey + "/lobby_full").set(status);
};
// fetches questions once the lobby is full and dispatches a  "START_GAME" msg
let fetchQ = (fillQuestions, startGame, key) => {
  // also set lobby full status
  setLobbyStatus(true, key);
  let Qurl = "GamesLobby/" + key + "/questions";
  db.ref(Qurl).on("value", snap => {
    let receivedQ = snap.val();
    if (receivedQ.length !== 0) {
      // fill our store with questions
      fillQuestions(receivedQ);
      startGame();
    }
  });
};

let PlayersJoin = ({ store, playerJoined, startGame, fillQuestions }) => {
  const key = store.lobby_key;
  let total_players_count = 0;

  if (calledOnce === false) {
    db.ref("GamesLobby/" + key).child("players").on("child_added", snap => {
      total_players_count += 1;
      // dispatch action through props
      playerJoined(snap.val());
      // Lobby full so fetch questions
      if (total_players_count === max_players) {
        fetchQ(fillQuestions, startGame, key);
      }

      
    });
    calledOnce = true;
  }

  let { players } = store;
  return (
    <div style={styles.wrapper}>
       {players.map(function(player) {
        return (
          <Chip key={player.userId} backgroundColor="#6200EA" labelColor="#fff" style={styles.chip}>
            <Avatar color="#fff" backgroundColor="#6200EA" icon={<SvgIconFace />} />
            {player.username}
          </Chip>
        );
      })}
    </div>
  );
}; //playersJoin

class Wait extends Component {
  render() {
    if (this.props.store.lobby_key == null) {
      return <Redirect to="/" />;
    }
    if (this.props.store.start_game_flag === true) {
      return <Redirect to="/Game_Center" />;
    }
    let { user } = this.props.store;
    return (
      <div className="waitPlayers">
        
        <div className="card">
          <LinearProgress className="waitLoading" color="#6200EA" mode="indeterminate"/>

           Waiting for
          {" "}
          <span className="violet">
           {max_players - this.props.store.players.length}
          </span>
         
          {" "}
          more {max_players - this.props.store.players.length===1? "player" : "players"} to join
          
          <div className="center">
            Connected
          </div>
          <Divider style={styles.divider}/>
          

          <PlayersJoin {...this.props} />
        </div>
        

      </div>
    ); //return
  } //render
}

function mapState(store) {
  return {
    store
  };
}

function mapDispatch(dispatch) {
  return {
    playerJoined: player => {
      dispatch({ type: "PLAYER_JOINED", player });
    },
    fillQuestions: questions => {
      dispatch({ type: "FILL_QUESTIONS", questions });
    },
    startGame: () => {
      dispatch({ type: "START_GAME" });
    }
  };
}

export default connect(mapState, mapDispatch)(Wait);
