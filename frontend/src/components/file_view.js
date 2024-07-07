import React, { useState, useEffect } from "react";
import { Viewer } from "@react-pdf-viewer/core"; // Import the Viewer component
import "@react-pdf-viewer/core/lib/styles/index.css"; // Import the default styles
import { useParams } from "react-router-dom";
import axios from "axios";

const DualDocumentViewer = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getDoc = async () => {
      try {
        const response = await axios.get(`/documents/${id}`);
        // Assuming the server sends a Blob or URL in the response
        setDocument(response.data); // Update state with fetched document data
        console.log("response data", response.data);
      } catch (error) {
        console.log("error from get ", error);
        setError(error);
      }
    };

    getDoc();
  }, [id]);

  if (error) {
    return <div>Error fetching document: {error.message}</div>;
  }

  if (!document) {
    return <p>Loading document...</p>;
  }

  return (
    <div>
      <pre>{document.originalText}</pre>
      <pre>{document.improvedText}</pre>
    </div>
  );
};

export default DualDocumentViewer;
