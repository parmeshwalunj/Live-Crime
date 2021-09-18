import React from "react";
import Button from '@mui/material/Button';
import { signInWithGoogle } from '../../firebase/authApi'

function Login() {

    const success = (user) => {
        console.log(user)
    }

    const failure = (code, error) => {
        console.log(error)
    }

    return (
        <Button color="inherit" onClick={() => signInWithGoogle(success, failure)}>Login</Button>
    );
}

export default Login;