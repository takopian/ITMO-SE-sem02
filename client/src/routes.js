import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {AuthPage} from './pages/AuthPage'
import {MainPage} from "./pages/MainPage";

export const useRoutes = isAuthenticated => {

        if (isAuthenticated) {
            return (
                <Switch>
                    <Route path="/profile" exact>
                        <MainPage />
                    </Route>
                    <Redirect to="/profile" />
                </Switch>
            )
        }

        return (
            <Switch>
                <Route path="/" exact>
                    <AuthPage />
                </Route>
                <Redirect to="/" />
            </Switch>
        )
}