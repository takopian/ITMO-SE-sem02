import React, {useContext, useEffect, useRef} from 'react'
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from '../../context/AuthContext'
import Button from "react-bootstrap/Button";
import './AuthPage.css';

export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const {loading, error, request} = useHttp()
    const loginRef = useRef();

    const facebookRegister = async () => {
        try {
            const data = await request('/profile')
            if (data.isOnline){
                auth.login(data.uid, data._id)
            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        facebookRegister().then()
    }, [loginRef])

    return (
        <div className="outerContainer">
            <div className="authHeader">
                <h1> GameBoard  </h1>
                <h2> Онлайн платформа для настольных игр</h2>
            </div>
            <div className="authContainer">
                <h3> Войти с помощью </h3>
                <div className="facebookAuthButton">
                    <Button
                        variant="primary"
                        onClick = {() => {window.location = "/auth/facebook"}}
                        ref={loginRef}
                        disabled={loading}
                    >
                        facebook
                    </Button>
                </div>
            </div>
        </div>
    )
}