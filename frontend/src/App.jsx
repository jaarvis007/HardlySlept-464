// import logo from './logo.svg';
import './App.css';
import Sample from './component/login/Login-SignUp.jsx';
import Login from './component/login/Login.jsx'
import SignUp from './component/login/SignUp.jsx'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Routes,Route} from "react-router-dom";
import Homepage from './component/login/HomePage.jsx';
import PrivateRoute from './component/Routes/Private.jsx';
import GameRoom from './component/Game/GameRoom.jsx';
import Otp from './component/login/Otp.jsx';
import Profile from './component/login/Profile.jsx';


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Sample/>}></Route>
        <Route path="/HomePage" element={<Homepage/>}></Route>
        <Route path="/game/" element={<Homepage/>}></Route>
        <Route path="/profile" element={<Profile/>}></Route>
        <Route path="/otp" element={<Otp/>}></Route>
      </Routes>
    </>

  );
}

export default App;