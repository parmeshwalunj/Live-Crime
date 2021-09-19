import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { signInWithGoogle, signOut } from "../../firebase/authApi";
import { getAuth } from "firebase/auth";

function Login({ setLoggedIn, loggedIn }) {
  const [toggle, setToggle] = useState(loggedIn ? "Login" : "Logout");

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
      }
    });
  }, [setLoggedIn]);

  const checkLogin = () => {
    let auth = getAuth();
    if (auth.currentUser == null) {
      signInWithGoogle(login);
    } else {
      signOut(logout);
    }
  };

  return (
    <Button color="inherit" onClick={checkLogin}>
      {toggle}
    </Button>
  );
}

export default Login;
