import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MdFileUpload } from "react-icons/md";
import { MdFileDownload } from "react-icons/md";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import { animateFill } from "tippy.js";
import "tippy.js/dist/backdrop.css";
import "tippy.js/animations/shift-away.css";
import { roundArrow } from "tippy.js";
import { saveAs } from "file-saver";

const DualDocumentViewer = () => {
  const mutationRef = React.useRef();
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

  async function downloadFile() {
    try {
      const response = await axios.get(`/download/${id}`, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/txt" }); // Set appropriate MIME type
      saveAs(blob, `Docuboost_${name}.txt`);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  }
  useEffect(() => {
    setDocument(null);
  }, [id]);

  useEffect(() => {
    getDoc();
  }, [id, refreshKey]);

  const handleRefresh = () => {
    console.log("window refresh");
    setDocument(null);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const createTooltips = useCallback(() => {
    if (mutationRef.current) {
      console.log("createing tooltip");
      tippy(".correction.tooltip", {
        content(reference) {
          return reference.getAttribute("data-edit");
        },
        animateFill: true,
        plugins: [animateFill],

        arrow: roundArrow,
      });
    }
  }, []);
  // useMutationObserver(mutationRef, createTooltips);

  useEffect(() => {
    if (document && document.improvedText) {
      // Delay to ensure DOM updates before initializing tooltips
      setTimeout(() => {
        createTooltips();
      }, 100);
    }
  }, [document, createTooltips]);

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
        <div className="doc-content original-text">
          <div className="content">{document.originalText}</div>
          <div className="text-title left">
            <div className="content-button">
              <MdFileUpload className="content-icon" />{" "}
              <div className="content-button-text">Upload</div>
            </div>
          </div>
        </div>
        <div className="divider"></div>
        <div className="doc-content">
          {document.improvedText ? (
            <div
              ref={mutationRef}
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
          <div className="text-title">
            <div className="content-button" onClick={() => downloadFile()}>
              <div className="content-button-text">Download</div>
              <MdFileDownload className="content-icon" />
              {/* {downloadUrl && (
                <a
                  href={downloadUrl}
                  download="myfile.pdf"
                  style={{ display: "none" }}
                >
                  Download Link
                </a>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DualDocumentViewer;
