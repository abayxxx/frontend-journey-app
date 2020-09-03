import React, { useState, useEffect } from "react";
import Home from "./components/Home";
import HomeUser from "./components/HomeUser";
import Detail from "./components/Detail";
import Profile from "./components/Profile";
import Bookmark from "./components/Bookmark";
import AddJourney from "./components/AddJourney";

import { ContextUser } from "./components/context/ContextUser";
import "./App.css";
import "./assets/css/stylesheet.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";

function App() {
  const [contextUser, setContextUser] = useState(null);

  useEffect(() => {
    if (localStorage.token) {
      setContextUser(true);
    }
  });

  function PrivateRoute({ children, ...rest }) {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          contextUser ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: location },
              }}
            />
          )
        }
      />
    );
  }
  return (
    <div className="App">
      <ContextUser.Provider value={{ contextUser, setContextUser }}>
        <Router>
          <Switch>
            <PrivateRoute exact path="/user-home">
              <HomeUser />
            </PrivateRoute>
            <Route exact path="/detail/:id">
              <Detail />
            </Route>
            <PrivateRoute exact path="/bookmark">
              <Bookmark />
            </PrivateRoute>
            <PrivateRoute exact path="/add-journey">
              <AddJourney />
            </PrivateRoute>
            <PrivateRoute exact path="/profile">
              <Profile />
            </PrivateRoute>
            <Route exact path="/">
              {contextUser ? <Redirect to="/user-home" /> : <Home />}
            </Route>
          </Switch>
        </Router>
      </ContextUser.Provider>
    </div>
  );
}

export default App;
