import * as React from "react";

// material ui
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

// components
import Report from "./Report";
import SearchBox from "./SearchBox";
import Login from "./Login";

// css
const NavStyle = {
  display: "flex",
  justifyContent: "space-between",
};

function NavBar({ setLoggedIn }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar style={{ backgroundColor: "black" }} position="static">
        <Toolbar style={NavStyle}>
          <Report />

          <SearchBox />

          <Login setLoggedIn={setLoggedIn} />
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NavBar;
