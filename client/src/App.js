import './App.css';
import {useRoutes} from "./routes";
import {BrowserRouter} from 'react-router-dom'
import {useAuth} from "./hooks/auth.hook";
import {AuthContext} from "./context/AuthContext";

function App() {
  const {token, login, logout, userId} = useAuth()
  const isAuthenticated = !!token
  const routes = useRoutes(isAuthenticated)
  return (
      <AuthContext.Provider value={{
        login, logout, userId, isAuthenticated
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
