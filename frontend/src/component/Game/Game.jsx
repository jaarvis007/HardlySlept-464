import { useContext, useEffect, useState } from "react";
import ChatBox from "./ChatBox.jsx";
import Timer from "./Timer.jsx";
import SocketContext from "../../context/SocketContext.jsx";
import GameContext from "../../context/GameContext.jsx";
import Player from "./Player.jsx";
import GameResult from "./GameResult.jsx";
import DrawingCanvas from "./DrawingCanvas.jsx";
import Logout from "../login/Logout.jsx";
import { useAuth } from "../../context/auth.jsx";
import "./Game.css";
import RoundResult from "./RoundResult.jsx";
import timeIcon from "../Assets/clock.png";
import LeaveBtn from "../login/LeaveBtn.jsx";
var i = 0;

function Game() {
  const [secondsLeft, setSecondsLeft] = useState(30);
  //const [buttonStatus,setButtonStatus] = useState("disabled");
  const [option, setOption] = useState([]);
  const [drawer, setDrawer] = useState("");
  const { socket } = useContext(SocketContext);
  const { game } = useContext(GameContext);
  const [hint, setHint] = useState("");
  const [auth, setAuth] = useAuth();
  const [phase, setPhase] = useState("");
  const [score, setScore] = useState(null);
  const [displayScore, setDisplayScore] = useState(false);

  function sendChosenWord(word) {
    socket.emit("word_chosen", { word: word });
    console.log(word);
    console.log("sendChosenWord");
    setOption([]);
  }

  useEffect(() => {
    if (score != null) {
      console.log(score);
    }
  }, [score]);

  useEffect(() => {
    console.log("useEffect");
    setHint(game.hint);
    setDrawer(game.drawer);
    setPhase(game.phase);
    setScore(game.player_names);
    socket.on("timer_change", (data) => {
      setSecondsLeft(data);
      console.log("time_change");
    });
    socket.on("feedback", (data) => {
      console.log(data);
    });
    socket.on("phase_change", (data) => {
      setPhase(data);
      console.log(data);
    });
    socket.on("drawer_change", (data) => {
      setDrawer(data.drawer);
      //Highlight the drawer in the leaderboard
      if (data.drawer == auth.user.username) {
        setOption(data.options);
      }
    });
    socket.on("send_hint", (data) => {
      setHint(data);
    });
    socket.on("score", (data) => {
      setScore(data);
      setDisplayScore(true);
      setTimeout(() => setDisplayScore(false), 5000);
    });
  }, []);

  return (
    <div>
      <div className="game-cont">
        <div className="game-header animated-div">
          <div className="game-timer">
            <div className="game-time">
              <img className="gameImg-timer" src={timeIcon} />
              <Timer time={secondsLeft} />
            </div>
          </div>
          <div className="game-words">
            {option.length != 0 ? (
              option.map((data, index) => {
                return (
                  <button
                    onClick={() => {
                      sendChosenWord(data);
                    }}
                  >
                    {data}
                  </button>
                );
              })
            ) : (
              <div></div>
            )}
          </div>
          <div className="game-hint">{hint}</div>
          <div className="game-logout">
            <Logout />
            <LeaveBtn />
          </div>
        </div>

        <div className="game-component">
          <div className="game-leaderboard animated-div">
            {score != null ? (
              Object.keys(game.player_names).map((data, index) => {
                if (score[data].active == true)
                  return <Player user={data} score={score[data]} />;
              })
            ) : (
              <></>
            )}
          </div>
          <div className="game-drawCanvas animated-div">
            <DrawingCanvas />
          </div>
          <div className="game-chat animated-div">
            <ChatBox />
          </div>
        </div>
      </div>

      {phase == "finished" ? (
        <div className="game-result animated-div">
          <h3 className="result-heading">Final Score</h3>
          <GameResult score={score} />
        </div>
      ) : (
        <></>
      )}

      {displayScore == true && phase !== "finished" ? (
        <div className="round-result">
          <h3 className="result-heading">ScoreCard</h3>
          <RoundResult score={score} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Game;
