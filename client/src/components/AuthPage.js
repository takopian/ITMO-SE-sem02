import React, {useContext, useEffect, useRef} from 'react'
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from '../context/AuthContext'
import Button from "react-bootstrap/Button";

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
                <h1> Auth Page </h1>
            </div>
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
    )
}