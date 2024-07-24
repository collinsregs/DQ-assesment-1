import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AppBar,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CloseIcon from "@mui/icons-material/Close";
import NoteAdd from "@mui/icons-material/NoteAdd";
import DescriptionIcon from "@mui/icons-material/Description";
import UserButton from "./user_button_logic";
import Button from "@mui/material/Button";

import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

function NavMobile() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const { isAuthenticated, user } = useAuth0();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  useEffect(() => {
    const getHistory = async () => {
      try {
        const email = isAuthenticated ? user.email : "";
        if (isAuthenticated) {
          const response = await axios.get("/userHistory", {
            headers: {
              "user-email": `${email}`,
            },
          });
          const data = response.data;

          for (let i = 0; i < data.length; i++) {
            let id = data[i].id;
            let parts = id.split("-");
            let name = parts[1].split(".")[0];
            data[i].name = name;
          }
          setDocuments(data);
        }
      } catch (error) {}
    };
    getHistory();
  }, [user, isAuthenticated]);

  function handNewDocument() {
    navigate("/");
  }

  function handleDocumentClick(id) {
    const encodedId = encodeURIComponent(id);
    navigate(`/documents/${encodedId}`);
  }

  const drawerContent = (
    <div>
      <Toolbar>
        <IconButton onClick={toggleDrawer()}>
          <CloseIcon />
          <div className="nav-mobile-button"> DocuBoost</div>
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1 }}
        ></Typography>
      </Toolbar>
      <List>
        <Tooltip title="Start a new Chat" arrow placement="right">
          <ListItem button key="new_chat" onClick={() => handNewDocument()}>
            <ListItemText
              primary={
                <div className="new_file ">
                  <NoteAdd />
                  <div className="nav-item-text">New Chat</div>
                </div>
              }
            />
          </ListItem>
        </Tooltip>
        {documents.map((doc) => (
          <Tooltip title={doc.name} arrow placement="right" key={doc.id}>
            <ListItem button onClick={() => handleDocumentClick(doc.id)}>
              <ListItemText
                primary={
                  <div className="new_file">
                    <DescriptionIcon />
                    <div className="nav-item-text">{doc.name}</div>
                  </div>
                }
              />
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </div>
  );

  return (
    <div className="nav-mobile">
      <Button onClick={toggleDrawer(true)}>
        <MenuIcon className="menu-icon" />
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </div>
  );
}

export default NavMobile;
