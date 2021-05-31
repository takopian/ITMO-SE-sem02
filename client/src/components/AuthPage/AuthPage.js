import React, {useContext, useEffect, useRef} from 'react'
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from '../../context/AuthContext'
import Button from "react-bootstrap/Button";
import './AuthPage.css';
import Card from "react-bootstrap/Card";

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
                        style={{backgroundColor: "white", borderColor: " white"}}
                        ref={loginRef}
                        disabled={loading}
                    >
                        <img  style={{width: 50}} src={process.env.PUBLIC_URL + '/facebook.png'} alt="Card image"/>
                    </Button>
                </div>
            </div>
        </div>
    )
}