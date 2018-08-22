import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import * as firebase from "firebase";
const db = firebase.database();

import Timer from "./utils";

// Material Components
import Divider from "material-ui/Divider";
import RaisedButton from "material-ui/RaisedButton";
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton";

import Lens from "material-ui/svg-icons/image/lens";
import CheckCircle from "material-ui/svg-icons/action/check-circle";
import Cancel from "material-ui/svg-icons/navigation/cancel";

import { red500, green500, grey900 } from "material-ui/styles/colors";

const styles = {
  divider: {
    marginTop: 10,
    marginBottom: 5,
    backgroundColor: "#e2e1e0",
    padding: "0.6px"
  },
  radioInput: {
    // backgroundColor:'red'
    fill: "#6200EA",
    stroke: "azure"
  }
};
// globals
let pListenerAdded = false;

function calculateScore(isCorrect) {
  if (isCorrect) return 10;
  return -2;
}

function ValidateOptionAndUpdate(props, chosenOption) {
  let { question } = props;
  let { user } = props.store;
  let { lobby_key } = props.store;
  // check if chosenOption is correct answer
  const isCorrect =
    question.options.indexOf(chosenOption) === question.answerIndex - 1;

  // console.log(isCorrect);
  // update store that user answered this question
  props.updateQuestionAnsweredByPlayer(question.qid, isCorrect);
  // add player scores to db
  db
    .ref("GamesLobby/" + lobby_key + "/players/" + user.userId + "/scores")
    .push(calculateScore(isCorrect));
} //validateoptionandupdate

class Question extends Component {
  handleQSub = e => {
    e.preventDefault();
    let chosenOption = e.target.elements["options"].value;

    ValidateOptionAndUpdate(this.props, chosenOption);
    //ask for next question
    this.props.nextQ();
  };

  // clear the radio button selection
  cleanOptionSelection = () => {
    // for first time its undefined
    if (this.refs.questionForm === undefined) return;
    this.refs.questionForm.elements["options"].forEach(optionEle => {
      optionEle.checked = false;
    });

    // console.log(this.refs.questionForm.elements["options"]);
  };

  timeUp = () => {
    let cOption = this.refs.questionForm.elements["options"].value;
    // if user selects any option before timeout validate the answer
    if (cOption !== "") {
      ValidateOptionAndUpdate(this.props, cOption);
    }
    // user didnt select any option so we simply skip
    this.props.nextQ();
  };

  render() {
    let { question } = this.props;
    this.cleanOptionSelection();
    // console.log(question);
    return (
      <form
        className="aside card quiz_form"
        ref="questionForm"
        name="questionForm"
        onSubmit={this.handleQSub}
      >
        <Timer count="80" timeUp={this.timeUp} qid={question.qid} />
        <label className="Question" htmlFor="">{question.question}</label>

        <RadioButtonGroup
          className="Options"
          id={question.qid}
          name={question.qid + ""}
        >
          {question.options.map(eachOption => {
            return (
              <RadioButton
                required
                id="options"
                key={eachOption}
                label={eachOption}
                value={eachOption}
                iconStyle={styles.radioInput}
              />
            );
          })}
        </RadioButtonGroup>

        {/*{question.options.map(eachOption => {
          return (
            <div key={eachOption}>
              <label htmlFor={eachOption}>{eachOption}</label>
              <input
                required
                type="radio"
                id="options"
                value={eachOption}
                name={question.qid}
              />
            </div>
          );
        })}*/}

        {/*<input ref="submitButton" type="submit" value="Submit" />*/}
        {""}
        <RaisedButton
          className="submitButton"
          ref="submitButton"
          type="submit"
          label="Submit"
          backgroundColor="#6200EA"
          labelColor="#fff"
        />
      </form>
    ); //return
  } //render
}

class QuestionContainer extends Component {
  render() {
    // console.log(this.props);
    let { store } = this.props;

    // console.log(store.current_selected_question);
    if (store.current_selected_question >= store.questions.length) {
      // All questions are answered by player
      // this.props.allQCompleted
      // console.log(this.props);

      if (store.all_questions_completed === false) {
        this.props.allQCompleted();
      }

      if (store.players[0].total === store.players[1].total) {
        return (
          <div className="card game_over">
            Game drawn with scores <span>{store.players[0].total}</span>
          </div>
        );
      } else {
        let winner = store.players[0];
        return (
          <div className="card game_over ">
            {" "}
            GAME IS OVER : winner is
            {" "}
            <span>{winner.username}</span>
            {" "}
            with score
            {" "}
            <span>{winner.total}</span>
            {" "}
          </div>
        );
      }
    } //questions over
    // console.log(store.current_selected_question);
    let currentQ = store.questions[store.current_selected_question];
    return <Question question={currentQ} {...this.props} />;
  }
}

let ScoreContainer = props => {
  let { players, lobby_key } = props.store;

  if (!pListenerAdded) {
    db.ref("GamesLobby/" + lobby_key + "/players").on("value", snap => {
      // console.log("update Players");
      let objPlayers = snap.val();
      // console.log(objPlayers);
      let tempPlayers = [];
      Object.keys(objPlayers).forEach(key => {
        let eachPlayer = objPlayers[key];
        let total = 0;
        if (eachPlayer.scores !== undefined) {
          Object.keys(eachPlayer.scores).forEach(key => {
            total += eachPlayer.scores[key];
          });
        }
        eachPlayer.total = total;
        tempPlayers.push(eachPlayer);
      }); //eachPlayer loop

      props.updatePlayers(tempPlayers);
    }); //eventListener

    pListenerAdded = true;
  }

  // console.log(players);
  return (
    <div className="aside card leaderboard">
      <strong>Leaderboard</strong>
      <Divider style={styles.divider} />
      {players.map(player => {
        return (
          <div
            className="player_leaderboard animated bounceIn"
            key={player.userId}
          >

            <span>{player.username}</span>
            <span>:{player.total}</span>
          </div>
        );
      })}
    </div>
  );
};

let UserName = props => {
  let { user, lobby_key } = props.store;

  return (
    <div className="User">
      <span>Welcome:{user.username}</span>
      <span> {lobby_key}</span>
      <p />
    </div>
  );
};

let PeekAnswer = props => {
  let { store } = props;
  // console.log("peek answer called");
  // console.log(store);
  if ((store.all_questions_completed === true) & (store.peek_answer !== null)) {
    let { questions } = store;
    let peekQuestion = questions
      .filter(obj => {
        if (obj.qid === store.peek_answer) return obj;
      })
      .pop();

    let peekSetColor;
    if (peekQuestion.gotCorrect_by_player === undefined) {
      peekSetColor = grey900;
    } else {
      peekSetColor = peekQuestion.gotCorrect_by_player ? green500 : red500;
    }
    return (
      <div
        className=" card peekAnswer"
        style={{ backgroundColor: peekSetColor }}
      >
        <label htmlFor="">Q: {peekQuestion.question}</label>
        <div>A: {peekQuestion.options[peekQuestion.answerIndex - 1]}</div>
      </div>
    );
  }

  return <div />;
};

let QuestionsStatus = props => {
  let { questions } = props.store;

  function handlePeekClick(e) {
    let peekAnswerNo;
    if (props.store.all_questions_completed === true) {
      if (e.target.nodeName === "path") {
        peekAnswerNo = e.target.parentNode.attributes["data-key"].value;
      } else {
        peekAnswerNo = e.target.attributes["data-key"].value;
      }

      props.selectPeek(peekAnswerNo);
    }
  } //handlePeekClick

  return (
    <div>

      <div
        className={
          "questions_status " +
            (props.store.all_questions_completed ? "peek" : "")
        }
      >
        <strong style={{ textAlign: "center" }}>
          {props.store.all_questions_completed ? "Click for Answers" : ""}
        </strong>
        {questions.map(eachQ => {
          if (eachQ.gotCorrect_by_player === true) {
            return (
              <CheckCircle
                className={
                  props.store.all_questions_completed
                    ? "animated repeat tada"
                    : ""
                }
                data-key={eachQ.qid}
                key={eachQ.qid}
                color={green500}
                onClick={handlePeekClick}
              />
            );
          } else if (eachQ.gotCorrect_by_player === false) {
            return (
              <Cancel
                className={
                  props.store.all_questions_completed
                    ? "animated repeat tada"
                    : ""
                }
                data-key={eachQ.qid}
                key={eachQ.qid}
                color={red500}
                onClick={handlePeekClick}
              />
            );
          }

          return (
            <Lens
              className={
                props.store.all_questions_completed
                  ? "animated repeat tada"
                  : ""
              }
              data-key={eachQ.qid}
              key={eachQ.qid}
              onClick={handlePeekClick}
            />
          );
        })}

        {/*<span onClick={handlePeekClick} data-key={eachQ.qid} key={eachQ.qid}>
            ○
          </span>*/}
        {/*<span
              className="question_correct"
              onClick={handlePeekClick}
              data-key={eachQ.qid}
              key={eachQ.qid}
            >
              {" "}✓{" "}
            </span>*/}
        {/*<span
              className="question_wrong"
              onClick={handlePeekClick}
              data-key={eachQ.qid}
              key={eachQ.qid}
            >
              {" "}❌
            </span>*/}

        <PeekAnswer {...props} />
      </div>
    </div>
  );
};

let GameCenter = props => {
  let { store } = props;
  if (store.lobby_key === null) {
    return <Redirect to="/" />;
  }
  return (
    <div className="GameCenter">
      <UserName {...props} />
      <QuestionsStatus {...props} />
      <QuestionContainer {...props} />
      <ScoreContainer {...props} />
    </div>
  );
};

function mapState(store) {
  return { store };
}

function mapDispatch(dispatch) {
  return {
    nextQ: () => {
      dispatch({ type: "NEXT_Q" });
    },
    updatePlayers: players => {
      dispatch({ type: "UPDATE_P_SCORES", players });
    },
    updateQuestionAnsweredByPlayer: (qid, status) => {
      dispatch({ type: "Q_ANSWERED_BY_PLAYER", qid, status });
    },
    allQCompleted: () => {
      dispatch({ type: "ALL_Q_COMPLETED" });
    },
    selectPeek: peekNo => {
      dispatch({ type: "SELECT_PEEK", peekNo });
    }
  };
}
export default connect(mapState, mapDispatch)(GameCenter);
