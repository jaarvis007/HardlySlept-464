import React from "react";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import GameContext from "../../context/GameContext";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";
import SocketContext from "../../context/SocketContext";
import "./RoomHandler.css";
import Logout from "./Logout";
import GameRoom from "../Game/GameRoom";

const RoomHandler = () => {
  const navigate = useNavigate();
  const { setSocket, socket } = useContext(SocketContext);
  const { game, setGame } = useContext(GameContext);
  const [auth, setAuth] = useAuth("");
  const [room, setRoom] = useState("");
  const [createRoom, setCreateRoom] = useState(null);
  const [joinRoom, setJoinRoom] = useState(null);
  const handleChange = (e) => {
    setRoom(e.target.value);
  };
  const params = new URLSearchParams(window.location.search);
  var roomurl;

  useEffect(() => {
    if (socket != null) {
      socket.on("no_game", (data) => {
        toast.warning(data.message);
      });
      socket.on("game_data", (data) => {
        setGame(data);
      });
    }
  }, [socket]);

  useEffect(() => {
    console.log("change in socket observed");
    console.log(params.get("room"));
    if (
      socket == null &&
      params.get("room") != undefined &&
      params.get("room") != null
    ) {
      roomurl = params.get("room");
      const socketTemp = io.connect("http://localhost:3001");
      setSocket(socketTemp);
    }
    if (
      socket != null &&
      params.get("room") != undefined &&
      params.get("room") != null
    ) {
      socket.emit("join_room", {
        type: "url",
        user: auth.user.username,
        room: roomurl,
      });
      console.log("emitted join_room inside useEffect" + roomurl);
      console.log("join in useEffect of socket" + roomurl);
    }
  }, [socket]);

  useEffect(() => {
    console.log("changing setCreateRoom");
    if (socket != null && createRoom != null) {
      socket.emit("create_room", createRoom);
    }
  }, [createRoom]);

  useEffect(() => {
    if (socket != null && joinRoom != null) {
      socket.emit("join_room", joinRoom);
    }
  }, [joinRoom]);

  useEffect(() => {
    if (game != null) {
      console.log("game data = " + game);
      navigate(`/game/?room=${game.roomNo}`);
    }
  }, [game]);

  function createRoomFun(type) {
    console.log("createRoom button");
    const socketTemp = io.connect("http://localhost:3001");
    setSocket(socketTemp);
    const data = { type: type, user: auth.user.username };
    setCreateRoom(data);
  }
  function joinRoomFun(type) {
    const socketTemp = io.connect("http://localhost:3001");
    setSocket(socketTemp);
    const data = { type: type, user: auth.user.username, room: room };
    setJoinRoom(data);
    console.log("join room button");
  }

  return (
    <div>
      {game == null ? (
        <div className="room-cont">
          <button
            id="publicButton"
            className="btn"
            onClick={() => {
              createRoomFun("public");
            }}
          >
            Create Public Room
          </button>

          <button
            id="privateButton"
            className="btn"
            onClick={() => {
              createRoomFun("private");
            }}
          >
            Create Private Room
          </button>

          <div className="publicRoom-cont">
            <input
              placeholder="Enter Room Code"
              className="msg-field"
              value={room}
              onChange={handleChange}
            />
            <button
              id="publicButton"
              className="btn"
              onClick={() => {
                joinRoomFun("private");
              }}
            >
              Join Private Room
            </button>
          </div>

          <button
            id="privateButton"
            className="btn"
            onClick={() => {
              joinRoomFun("public");
            }}
          >
            Join Public Room
          </button>

          {/* <Logout className='btn'/>
  
              <button id="profile" onClick={(() => navigate('/profile'))}>Profile</button> */}

          <div className="rcAction-btn">
            <button
              className="profile-btn"
              id="profile"
              onClick={() => navigate("/profile")}
            >
              Profile
            </button>
            <Logout className="btn" />
          </div>
        </div>
      ) : (
        <GameRoom />
      )}
    </div>
  );
};

export default RoomHandler;
