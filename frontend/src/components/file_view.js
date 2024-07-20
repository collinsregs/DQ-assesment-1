import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DualDocumentViewer = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  let parts = id.split("-");
  let name = parts[1].split(".")[0];

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

  useEffect(() => {
    getDoc();
  }, [id, refreshKey]);

  const handleRefresh = () => {
    console.log("window refresh");
    setDocument(null);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  if (error) {
    return (
      <div className="dual-document-viewer">
        <div className="document-title">{name}</div>
        <div className="doc-container">
          <div className="content content-warning">
            <span
              className="content-warning-span"
              onClick={() => handleRefresh()}
            >
              Error fetching document. Please refresh ...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="dual-document-viewer">
        <div className="document-title">{name}</div>
        <div className="doc-container">
          <div className="loader-container">
            <div class="loader"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dual-document-viewer">
      <div className="document-title">{name}</div>
      <div className="doc-container">
        <div className="doc-content">
          <div className="content">{document.originalText}</div>
          <div className="text-title">original text</div>
        </div>
        <div className="divider"></div>
        <div className="doc-content">
          {document.improvedText ? (
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: document.improvedText }}
            />
          ) : (
            <div className="content content-warning">
              <span
                className="content-warning-span"
                onClick={() => handleRefresh()}
              >
                Faileld to load improvements. please refresh ...
              </span>
            </div>
          )}
          <div className="text-title">Improved Text</div>
        </div>
      </div>
    </div>
  );
};

export default DualDocumentViewer;
