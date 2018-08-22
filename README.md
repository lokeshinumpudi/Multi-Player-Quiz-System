# Multi Player Quiz
`Realtime multi player quiz application with Match Making System.`

# Working Application

    Game Lobby
![Game Lobby](https://raw.githubusercontent.com/lokeshinumpudi/Multi-Player-Quiz-System/master/Game_Content/game_lobby_2.png)

    Game Screen with players in lobby answering questions
![Game Screen](https://raw.githubusercontent.com/lokeshinumpudi/Multi-Player-Quiz-System/master/Game_Content/game_screen_1.png)

    Game Finished with scores updated and winner
![Game finished](https://raw.githubusercontent.com/lokeshinumpudi/Multi-Player-Quiz-System/master/Game_Content/game_done.png)


# Features
- `Match making system :` Connects players in real time and provides questions to the connected users. 

- `Game Lobby :` Each Lobby waits for players to join and the players in that lobby receive the same set of questions. There can be multiple lobbies with many players at the same time.

- `Lobby Scores Sync :` Players in each lobby will receive the score updates of all the players in the same lobby in realtime. 

# Technologies 

### Client
- `React.js :` To build the user interface.
- `Redux :`  Manages the state of the entire game.
- `Firebase Client SDK :` Keeps the game scores in sync with other players.

### Server
- `Firebase Cloud Functions :` Match making system and manages the connections, score updates between the players.
    
### Database
- `Firebase Real Time Database :` Storage for the data generated in the game.
### Hosting
- `Firebase Hosting:` Hosting for the application.
