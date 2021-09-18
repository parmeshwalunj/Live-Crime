import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import { signInWithGoogle, signOut } from '../../firebase/authApi'
import { getAuth } from 'firebase/auth'

function Login() {

    const [toggle, setToggle] = useState("Login")

    const login = () => {
        setToggle("logout")
    }

    const logout = () => {
        setToggle("login")
    }

    const failureCallBack = (err) => {
        console.log(err)
    }

    useEffect(() => {
        console.log("hello")
        signInWithGoogle(login,failureCallBack)
    }, []);

    const checkLogin = () => {
        let auth = getAuth();
        if (auth.currentUser == null) {
            signInWithGoogle(login);
        } else {
            signOut(logout);
        }
    }

    return (
        <Button color="inherit" onClick={checkLogin}>{toggle}</Button>
    );
}

export default Login;