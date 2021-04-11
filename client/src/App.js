import './App.css';
import {useRoutes} from "./routes";
import {BrowserRouter} from 'react-router-dom'
import {useAuth} from "./hooks/auth.hook";
import {AuthContext} from "./context/AuthContext";
import React from "react";

function App() {
  const {token, login, logout, userId, roomId, join, leave} = useAuth()
  const isAuthenticated = !!token;
  const isJoinedToRoom = !!roomId;
  const routes = useRoutes({isAuthenticated, isJoinedToRoom})

  return (
      <AuthContext.Provider value={{
        login, logout, userId, isAuthenticated, roomId, join, leave
      }}>
      <BrowserRouter>
        <div className="App">
          {routes}
        </div>
      </BrowserRouter>
      </AuthContext.Provider>
  );
}

export default App;
