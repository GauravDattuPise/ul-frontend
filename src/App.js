import { Routes, Route, useNavigate, json } from "react-router-dom"

import Header from './layout/Header';
import Login from './pages/admin/login/Login';
import Register from './pages/admin/register/Register';

import './App.css';
import AddUser from "./pages/user/addusers/AddUser";
import GetUsers from "./pages/user/getusers/GetUsers";
import UpdateUser from "./pages/user/updateuser/UpdateUser";
import { createContext, useCallback, useEffect, useState } from "react";

export const GlobalLoginState = createContext();

function App() {

  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  function loginStateHandle(value) {
    setIsLogin(value)
  }

  const login = useCallback(() => {
    loginStateHandle(true);
    if (isLogin) {
      navigate("/getAllUsers");
    }
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.token) {
      login();
    } else {
      // if not logged in
      navigate("/");
    }
  }, [isLogin]);

  useEffect(() => {
    let logoutTimer;

    if (isLogin) {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (userData) {
        const expirationDate = new Date(userData.expiration);
        const currentTime = new Date().getTime();
        const remainingTime = expirationDate.getTime() - currentTime;

        if (remainingTime > 0) {
          logoutTimer = setTimeout(() => {
            logout();
          }, remainingTime);
        }
      }
    }
    return () => {
      clearTimeout(logoutTimer);
    };
  }, [isLogin]);

  // logout function 
  const logout = () => {
    loginStateHandle(false);
    localStorage.removeItem("userData");
    
    navigate("/");
  };

  return (
    <GlobalLoginState.Provider value={{isLogin,loginStateHandle}}>
    <div style={{ background: "rgb(230, 212, 188)", minHeight: "800px" }}>
  
      <Routes>        
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/addUser" element={<AddUser />} />
        <Route path="/getAllUsers" element={<GetUsers/>} />
        <Route path="/updateUser/:userId" element={<UpdateUser/>}/>
      </Routes>
    </div>
    </GlobalLoginState.Provider>
  );
}

export default App;
