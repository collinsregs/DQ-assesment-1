import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useAuth0 } from "@auth0/auth0-react";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth0();

  const email = isAuthenticated ? user.email : " ";
  const testUrl = "https://637a9a66-653a-4566-8c2b-271d2989e23c.mock.pstmn.io";

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setSelectedFile(acceptedFiles[0]);
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
      width: "60vw",
      height: "35vh",
      border: "2px dashed #ccc",
      borderRadius: "5px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      marginBottom: "20px",
    },
    dragActive: {
      border: "2px dashed #333",
    },
    text: {
      textAlign: "center",
      color: "#777",
    },
    fileInfo: {
      fontSize: ".8rem",
      color: "#333",
      margin: "10px 0",
    },
    fileInput: {
      display: "none",
    },
  };

  return (
    <div div className="file-upload">
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
            {isDragActive ? (
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
          <div className="upload-file-name"></div>
          <button onClick={handleFileUpload}>
            <ArrowUpwardIcon />
          </button>
        </div>
      </div>
      {selectedFile && (
        <div>
          <p style={styles.fileInfo}>File Name: {selectedFile.name}</p>
          <p style={styles.fileInfo}>File Type: {selectedFile.type}</p>
          <p style={styles.fileInfo}>
            File Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
