import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { signInWithGoogle, signOut } from "../../firebase/authApi";
import { getAuth } from "firebase/auth";

function Login({ setLoggedIn, loggedIn }) {
  const [toggle, setToggle] = useState(loggedIn ? "Logout" : "Login");

  const login = () => {
    setToggle("logout");
  };

  const logout = () => {
    setToggle("login");
  };

  useEffect(() => {
    getAuth().onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
  }, [setLoggedIn]);

  const checkLogin = () => {
    if (loggedIn) {
      signOut(logout, console.log);
    } else {
      signInWithGoogle(login, console.log);
    }
  };

  return (
    <Button color="inherit" onClick={checkLogin}>
      {toggle}
    </Button>
  );
}

export default Login;
