import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch
    }
    from "react-router-dom";
import {AuthPage} from './pages/AuthPage'
import {MainPage} from "./pages/MainPage/MainPage";
import {RoomPage} from "./pages/RoomPage/RoomPage";

export const useRoutes = ({isAuthenticated, isJoinedToRoom}) => {
        if (isAuthenticated) {
            if (isJoinedToRoom) {
                return (
                    <Switch>
                        <Route path="/room">
                            <RoomPage />
                        </Route>
                        <Redirect to="/room"/>
                    </Switch>
                )
            }
            return (
                    <Switch>
                    <Route path="/profile" exact>
                        <MainPage />
                    </Route>
                    <Route path="/room">
                        <RoomPage />
                    </Route>
                    <Redirect to="/profile"/>
                    </Switch>
            )
        }

        return (
            <Router>
                <Route path="/" exact>
                    <AuthPage />
                </Route>
                <Redirect to="/" />
            </Router>
        )
}