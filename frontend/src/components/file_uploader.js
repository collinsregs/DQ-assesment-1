import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdFileUpload } from "react-icons/md";
import UploadIcon from "@mui/icons-material/Upload";
import { FaFileArrowUp } from "react-icons/fa6";
import { useAuth0 } from "@auth0/auth0-react";
import { ReactComponent as Logo } from "./logo-full-transparent.svg";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth0();

  const email = isAuthenticated ? user.email : " ";

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setSelectedFile(acceptedFiles[0]);
    },
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/msword": [".doc"],
      "text/plain": [".txt"],
    },
  });

  const handleFileUpload = async () => {
    if (!selectedFile) return; // Handle no file selected case

    const formData = new FormData(); // Create a FormData object
    formData.append("file", selectedFile); // Add the file to the FormData

    try {
      const response = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "user-email ": `${email}`,
        },
      });
      console.log("File upload response:", response.data);
      if (response.data.route) {
        // Get the navigate function
        const routeParts = response.data.route.split("/");
        const id = routeParts[2]; // Assuming the ID is always at index 2
        // console.log("Extracted ID:", id);

        navigate(response.data.route);
      }

      // Handle successful upload (e.g., clear state, display success message)
    } catch (error) {
      console.error("File upload error:", error);
      // Handle upload errors (e.g., display error message)
    }
  };

  const styles = {
    container: {
      width: "40vw",
      height: "20vh",
      border: "2px dashed var(--color-text)",
      borderRadius: "5px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      marginBottom: "20px",
      // backgroundColor: "var(--color-light-background)",
    },
    dragActive: {
      border: "2px dashed var(--color-text)",
    },
    text: {
      textAlign: "center",
      color: "var(--color-text)",
    },
    fileInfo: {
      fontSize: ".8rem",
      color: "var(--color-highlight)",
      margin: "10px 0",
    },
    fileInput: {
      display: "none",
    },
  };

  return (
    <div div className="file-upload">
      <Logo className="logo" />

      <div className="upload-container">
        <div
          {...getRootProps({
            style: styles.container,
            className: isDragActive && styles.dragActive,
          })}
        >
          <input
            {...getInputProps()}
            onChange={(event) => setSelectedFile(event.target.files[0])}
          />
          <label htmlFor="fileInput">
            {selectedFile ? (
              <FaFileArrowUp className="file-input" />
            ) : isDragActive ? (
              <p style={styles.text}>Drop your file here!</p>
            ) : (
              <p style={styles.text}>
                Drag & drop a file here, or click to select
              </p>
            )}
          </label>
          <input id="fileInput" type="file" style={styles.fileInput} />
        </div>
        <div className="upload-input-field">
          <div className="upload-file-name">
            {selectedFile ? selectedFile.name : ""}
          </div>
          <button className="upload-button" onClick={handleFileUpload}>
            <MdFileUpload className="upload-button-svg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
