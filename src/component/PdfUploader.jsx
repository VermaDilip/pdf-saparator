import React, { useState } from 'react';
// import { PDFDocument } from 'pdf-lib';
import { PDFDocument } from 'pdf-lib';


const PdfUploader = () => {
  const [pages, setPages] = useState([]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const pdfBytes = new Uint8Array(e.target.result);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const totalPages = pdfDoc.getPageCount();
      const pdfPages = [];

      for (let i = 0; i < totalPages; i++) {
        const singlePageDoc = await PDFDocument.create();
        const [copiedPage] = await singlePageDoc.copyPages(pdfDoc, [i]);
        singlePageDoc.addPage(copiedPage);
        const pdfDataUri = await singlePageDoc.saveAsBase64({ dataUri: true });
        pdfPages.push(pdfDataUri);
      }
      setPages(pdfPages);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="outer-container">
      <div className="header-container">
        <h1 className="title">PDF Uploader</h1>
        <input type="file" accept="application/pdf" onChange={handleFileChange} className="file-input" />
      </div>

      <div className="grid-container">
        {pages.map((page, index) => (
          <div key={index} className="card">
            <iframe src={page} className="iframe" title={`Page ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PdfUploader;