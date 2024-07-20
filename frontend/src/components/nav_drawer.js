import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import NoteAdd from "@mui/icons-material/NoteAdd";
import DescriptionIcon from "@mui/icons-material/Description";
import Tooltip from "@mui/material/Tooltip";

import UserButton from "./user_button_logic";

import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

function Nav() {
  const [isListOpen, setListOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const { isAuthenticated, user } = useAuth0();
  const navigate = useNavigate();

  const handleToggleList = () => {
    setListOpen(!isListOpen); // Toggle the state when the menu icon is clicked
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
  return (
    <div className="nav-grid">
      <div className="nav-header">
        <IconButton onClick={handleToggleList}>
          {isListOpen ? (
            <div className="header-button">
              <CloseIcon />
              <div className="menu-text">DocuBoost</div>
            </div>
          ) : (
            <div className="header-button">
              <MenuIcon />
            </div>
          )}
        </IconButton>
      </div>

      <List className="nav-list">
        <Tooltip title="Start a new Chat" arrow placement="right">
          <ListItem
            button
            className="list-item"
            onClick={() => handNewDocument()}
          >
            <ListItemText
              className="icon "
              data-text="New Chat"
              primary={
                isListOpen ? (
                  <div className="new_file ">
                    <NoteAdd />
                    <div className="nav-item-text">New Chat</div>
                  </div>
                ) : (
                  <div className="new_file">
                    <NoteAdd />
                  </div>
                )
              }
            />
          </ListItem>
        </Tooltip>
        {documents.map((doc) => (
          <Tooltip title={doc.name} arrow placement="right">
            <ListItem
              button
              key={doc.id}
              onClick={() => handleDocumentClick(doc.id)}
            >
              <ListItemText
                className="no-wrap"
                primary={
                  isListOpen ? (
                    <div className="new_file">
                      <DescriptionIcon />
                      <div className="nav-item-text">{doc.name}</div>
                    </div>
                  ) : (
                    <div className="new_file">
                      <DescriptionIcon />
                    </div>
                  )
                }
              />
            </ListItem>
          </Tooltip>
        ))}
      </List>

      <div className="nav-user">
        <UserButton isListOpen={isListOpen} />
      </div>
    </div>
  );
}

export default Nav;
