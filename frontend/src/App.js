import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import FileUpload from "./components/file_uploader";
import DualDocumentViewer from "./components/file_view";

function App() {
  return (
    <Router>
      <div className="App">
        <div className="main">
          <div className="content-block-1">block 1</div>
          <div className="content-block-2">
            <Routes>
              <Route path="/" element={<FileUpload />} />
              <Route path="/documents/:id" element={<DualDocumentViewer />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
