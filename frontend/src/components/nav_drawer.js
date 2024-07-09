import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddBox from "@mui/icons-material/AddBox";
import UserButton from "./user_button_logic";
import AccountBox from "@mui/icons-material/AccountBox";
import LoginButton from "./login_button";

function Nav() {
  const [isListOpen, setListOpen] = useState(false); // Initialize state for list open/closed

  const handleToggleList = () => {
    setListOpen(!isListOpen); // Toggle the state when the menu icon is clicked
  };
  return (
    <div className="nav-grid">
      <div className="nav-header">
        <IconButton onClick={handleToggleList}>
          <MenuIcon />
        </IconButton>
      </div>
      <div className="nav-list">
        <List>
          <ListItem button>
            <AddBox className="icon" />
            <ListItemText primary={isListOpen ? "New File" : ""} />
          </ListItem>
          <ListItem button>
            <ListItemText primary={isListOpen ? "Item______1" : ""} />
          </ListItem>
          <ListItem button>
            <ListItemText primary={isListOpen ? "Item 2" : ""} />
          </ListItem>
        </List>
      </div>
      <div className="nav-user">
        <List>
          <UserButton />
        </List>
      </div>
    </div>
  );
}

export default Nav;
