import React from 'react'
import './Login.css'

function Login() {

    const handleSignIn = () => {};

    return (
        <div className="login">
            <div className="login__body">
                <img alt="Chat Application" src="https://i.imgur.com/uUqkiYo.png"/>
                <div className="login__text">
                    <h1>Welcome To Chat App</h1>
                </div>
                <div className="google-btn"
                    onClick={handleSignIn}>
                    <div className="google-icon-wrapper">
                        <img alt="google-icon" className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
                    </div>
                    <p className="btn-text">
                        <b>Sign in with google</b>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
