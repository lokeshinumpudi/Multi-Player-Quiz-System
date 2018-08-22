import { createStore } from "redux";

const initialStore = {
  start_game_flag: false,
  lobby_key: null,
  lobby_found: false,
  user: null,
  players: [],
  questions: [],
  current_selected_question: 0,
  all_questions_completed: false,
  peek_answer: 2
};

let testStore = JSON.parse(
  `{"start_game_flag":true,
    "current_selected_question":0,
    "all_questions_completed":false,
    "peek_answer":1,
    "lobby_key":"Game:1492492799581",
    "lobby_found":true,
    "user":{"username":"Player4","userId":"Player41492493195677"},"players":[{"userId":"Player161492492798672","username":"Player16","total":0},{"userId":"Player41492493195677","username":"Player4","total":0},{"userId":"Player91492493189516","username":"Player9","total":0}],"questions":[{"answerIndex":2,"options":["Image file","Animation/movie file","Audio file","MS Office document"],"qid":1,"question":"'.MOV' extension refers usually to what kind of file?"},{"answerIndex":2,"options":["Jeff Bezos","Sundar Pichai","Satya nadella","Sergey Brin"],"qid":2,"question":"Who is the CEO of Google?"},{"answerIndex":1,"options":["Sachin Tendulkar","Virat Kohli","Ms Dhoni","Virender Sehwag"],"qid":3,"question":"Who is the first cricketer to score a double century in One Day International "},{"answerIndex":4,"options":["Steve Jobs","Mark Zuckerberg","Warren Buffet","Bill Gates"],"qid":4,"question":"Who is the richest man in the world?"},{"answerIndex":1,"options":["Films","Music","Technology","Sports"],"qid":5,"question":"Oscars are awarded to?"}]}`
);

const nameReducer = (store = initialStore, action) => {
  switch (action.type) {
    case "START_GAME": {
      return { ...store, start_game_flag: true };
    }

    case "FILL_QUESTIONS": {
      return { ...store, questions: action.questions };
    }

    case "ALL_Q_COMPLETED": {
      return { ...store, all_questions_completed: true };
    }

    case "SET_USER": {
      return { ...store, user: action.user };
    }

    case "SELECT_PEEK": {
      let peekno = parseInt(action.peekNo, 10);
      return { ...store, peek_answer: peekno };
    }

    case "Q_ANSWERED_BY_PLAYER": {
      let { qid, status } = action;
      // console.log(qid, status);

      let TempQues = Object.assign([], store.questions);

      // console.log(TempQues);
      TempQues.forEach(eachQ => {
        if (eachQ.qid === qid) {
          eachQ.gotCorrect_by_player = status;
        }
      });

      return { ...store, questions: TempQues };
    }

    case "UPDATE_P_SCORES": {
      // console.log(action.player);
      // let {userId,total} = action.player;
      // let newPlayers = Object.assign([],store.players);
      // newPlayers.forEach((eachPlayer,index)=>{
      //     if(eachPlayer.userId === userId){
      //         // update this player with score
      //         let UpdatedPlayer = Object.assign({},eachPlayer,total);
      //         newPlayers.splice(index,1,UpdatedPlayer);

      //     }
      // });
      // console.log(newPlayers);
      let sortedPlayers = action.players.sort((p1, p2) => {
        if (p1.total < p2.total) {
          return 1;
        }
        if (p1.total > p2.total) {
          return -1;
        }
        return 0;
      });
      return { ...store, players: sortedPlayers };

      // return store;
    }

    case "NEXT_Q": {
      if (store.current_selected_question < store.questions.length) {
        let newIndex = store.current_selected_question + 1;
        // console.log("next question selected");
        return { ...store, current_selected_question: newIndex };
      }
      return store;
    }

    case "PLAYER_JOINED": {
      let newPlayers = store.players.concat([action.player]);
      let newStore = { ...store, players: newPlayers };

      // console.log(newPlayers);
      return newStore;
    }

    case "CHANGE_LOBBY": {
      return { ...store, lobby_key: action.key };
    }

    case "LOBBY_FOUND": {
      return { ...store, lobby_found: true };
    }

    default: {
      return store;
    }
  } //switch
};

const appStore = createStore(nameReducer);

// appStore.subscribe(()=>{
//     console.log(appStore.getState());
// });

// appStore.dispatch({
//     type:"CHANGE_NAME",
//     name:"maxis"
// })
export default appStore;
