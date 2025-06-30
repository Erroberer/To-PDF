import React, { useState, useRef } from "react";
import axios from "axios";

const FILE_TYPES = [
  { name: "docx", className: "docx" },
  { name: "xlsx", className: "xlsx" },
  { name: "pptx", className: "pptx" },
  { name: "jpg", className: "jpg" },
  { name: "png", className: "png" },
  { name: "txt", className: "txt" },
  { name: "...", className: "more" },
];

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [downUrl, setDownUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showTypes, setShowTypes] = useState(false);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setDownUrl("");
    setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setDownUrl("");
      setError("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Bir dosya seçin veya sürükleyin.");
      return;
    }
    setLoading(true);
    setError("");
    setDownUrl("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "https://to-pdf-backend.onrender.com",
        formData,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownUrl(url);
    } catch (err) {
      setError("Dönüştürme başarısız!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="title-row">
        <span
          className="animated-title only-animated"
          onMouseEnter={() => setShowTypes(true)}
          onMouseLeave={() => setShowTypes(false)}
          onTouchStart={() => setShowTypes(true)}
          onTouchEnd={() => setShowTypes(false)}
        >
          Her Dosyayı
          
          
        </span>
        <span className="static-title">
          <span className="highlight">PDF'e Dönüştür</span>
        </span>
      </div>
      <form onSubmit={handleUpload}>
        <div
          className="dropzone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => inputRef.current.click()}
        >
          <input
            type="file"
            ref={inputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          {file ? (
            <div className="filename">{file.name}</div>
          ) : (
            <div className="dropzone-text">
              Dosyanı buraya sürükle veya tıkla
            </div>
          )}
        </div>
        <button
          type="submit"
          className={`convert-btn${loading ? " loading" : ""}`}
          disabled={loading}
        >
          {loading ? "Dönüştürülüyor..." : "PDF'ye Dönüştür"}
        </button>
      </form>
      {downUrl && (
        <div className="result-box">
          <a href={downUrl} download="donusturulen.pdf">
            PDF'yi İndir
          </a>
        </div>
      )}
      {error && <div className="error-box">{error}</div>}
    </div>
  );
};

export default FileUploader;
