var functions = require("firebase-functions");
const admin = require("firebase-admin");


// init the admin acces from the cloud functions itself
admin.initializeApp();

// Generate the questions
let genQ = no => {
  let Ques = [];
  for (let i = 0; i < no; i++) {
    let questionFormat = {
      qid: null,
      question: "Hey choose an option in random.",
      options: ["option:1", "option:2", "option:3", "option:4"],
      answerIndex: null
    };
    questionFormat.qid =
      Date.now() * (Math.ceil(Math.random() + i) * no + i) + i;
    questionFormat.answerIndex = Math.ceil(Math.random() * 4);
    // Ques[questionFormat.qid] = questionFormat;
    Ques.push(questionFormat);
  }
  return Ques;
}; //genQ

let genAmazingQ = (no) => {
  let AQues = [
    {
      qid: 1,
      question: "Which model has the hight number of Vogue covers ?",
      options: ["Cara delevigne", "Gigi Hadid", "Adriana Lima", "Taylor Swift"],
      answerIndex: 2
    },
    {
      qid: 2,
      question: "Forbes highest earned celebrity for 2016 ?",
      options: [
        "Taylor swift",
        "Katy perry",
        "Dwayne the (rock) Johnson",
        "One direction"
      ],
      answerIndex: 1
    },
    {
      qid: 3,
      question: "Model who was featured in a pepsi advert in 2017 is?",
      options: [
        "Doutzen Cross",
        "Gigi Hadid",
        "Adriana Lima",
        "Kendall Jenner"
      ],
      answerIndex: 4
    },
    {
      qid: 4,
      question: "Who is the wife of Ellen de Gen ?",
      options: [
        "Katie holmes",
        "portia De rossi",
        "Carry Underwood",
        "oprah winfrey"
      ],
      answerIndex: 2
    },
    {
      qid: 5,
      question: "Using which Technology this site was build ?",
      options: ["Angular", "Ember", "React", "Vue.js"],
      answerIndex: 3
    }
  ];

  let newQ = [
    {
      qid: 1,
      question: "Which model has the hight number of Vogue covers ?",
      options: ["Cara delevigne", "Gigi Hadid", "Adriana Lima", "Taylor Swift"],
      answerIndex: 2
    },
    {
      qid: 2,
      question: "Forbes highest earned celebrity for 2016 ?",
      options: [
        "Taylor swift",
        "Katy perry",
        "Dwayne the (rock) Johnson",
        "One direction"
      ],
      answerIndex: 1
    },
    {
      qid: 3,
      question: "Model who was featured in a pepsi advert in 2017 is?",
      options: [
        "Doutzen Cross",
        "Gigi Hadid",
        "Adriana Lima",
        "Kendall Jenner"
      ],
      answerIndex: 4
    },
    {
      qid: 4,
      question: "Who is the wife of Ellen de Gen ?",
      options: [
        "Katie holmes",
        "portia De rossi",
        "Carry Underwood",
        "oprah winfrey"
      ],
      answerIndex: 2
    },
    {
      qid: 5,
      question: "Using which Technology this site was build ?",
      options: ["Angular", "Ember", "React", "Vue.js"],
      answerIndex: 3
    },
    {
      qid: 6,
      question: "'.MOV' extension refers usually to what kind of file?",
      options: [
        "Image file",
        "Animation/movie file",
        "Audio file",
        "MS Office document"
      ],
      answerIndex: 2
    },
    {
      qid: 7,
      question: "Who is the CEO of Google?",
      options: ["Jeff Bezos", "Sundar Pichai", "Satya nadella", "Sergey Brin"],
      answerIndex: 2
    },
    {
      qid: 8,
      question: "Who is the first cricketer to score a double century in One Day International ",
      options: [
        "Sachin Tendulkar",
        "Virat Kohli",
        "Ms Dhoni",
        "Virender Sehwag"
      ],
      answerIndex: 1
    },
    {
      qid: 9,
      question: "Who is the richest man in the world?",
      options: ["Steve Jobs", "Mark Zuckerberg", "Warren Buffet", "Bill Gates"],
      answerIndex: 4
    },
    {
      qid: 10,
      question: "Oscars are awarded to?",
      options: ["Films", "Music", "Technology", "Sports"],
      answerIndex: 1
    },
    {
      qid: 11,
      question: "What is the world's longest river?",
      options: ["Amazon", "Nile", "Yangtze", "Narmada"],
      answerIndex: 1
    },
    {
      qid: 12,
      question: "Who played Neo in The Matrix?",
      options: ["Tom Cruise", "Will Smith", "Brad Pitt", "Keanu Reeves"],
      answerIndex: 4
    },
    {
      qid: 13,
      question: "What is the capital city of Spain?",
      options: ["Greece", "France", "Madrid", "Austria"],
      answerIndex: 3
    },
    {
      qid: 14,
      question: "Name the world's largest ocean?",
      options: ["Atlantic Ocean", "Pacific Ocean", "Artic Ocean ", "Indian Ocean"],
      answerIndex: 2
    },
    {
      qid: 15,
      question: "A shorter exhaust pipe would generally be ______ than a longer one?",
      options: ["Louder", "Quieter", "no effect"],
      answerIndex: 1
    }
  ];

  let randomQIndexs = [];
  let randomQ = [];
  // get 10 random questions from the newQ
  if (newQ.length > 6) {
    // run this until we find 5 random questions
    while (randomQIndexs.length <= no) {
      let randomIndex = Math.ceil(Math.random() * newQ.length);
      if (randomQIndexs.indexOf(randomIndex) == -1) {
        
        //now collect the quesions in this randomIndexe
        let isQExist = newQ[randomIndex];
        if(isQExist != undefined){
            randomQIndexs.push(randomIndex);
            randomQ.push(newQ[randomIndex]);
        }
        
      }
    } //while
    return randomQ;
  } else {
    return newQ;
  }
};

exports.populateLobby = functions.https.onRequest((req, res) => {
  const no = parseInt(req.query.no, 10);
  const lobbyId = req.query.id + "";
  const isAmazingGame = parseInt(req.query.amazing, 10);

  let questions = null;

  if (isAmazingGame === 1 || isAmazingGame === "1") {
    questions = genAmazingQ(no);
  } else {
    questions = genQ(no);
  }

  return admin
    .database()
    .ref("GamesLobby/" + lobbyId + "/questions")
    .set(questions)
    .then(snap => {
      // send response back
      res.set("Content-Type", "application/json");
      res
        .status(200)
        .send({ status: "success", count: questions.length, isAmazingGame });
      res.end();
    });
});

// exports.test = functions.https.onRequest((req, res) => {
//   let name = req.query.name;
//   const no = req.query.no;
//   res.set("Content-Type", "application/json");
//   res.status(200).send({ name: name, no: no });
//   res.end();
// });

// exports.monitorGames = functions.database.ref("GamesLobby").onWrite(event=>{
//   return   console.log(event.data.val());
// })
