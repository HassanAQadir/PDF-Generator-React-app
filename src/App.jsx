import React, { useState } from "react";
import { jsPDF } from "jspdf";

export default function App() {
  const [title, setTitle] = useState("");
  const [fields, setFields] = useState({
    costCenter: "",
    purpose: "",
    user: "",
    location: "",
    brand: "",
    model: "",
    type: "",
    year: "",
  });
  const [pic1DataUrl, setPic1DataUrl] = useState(null);
  const [pic2DataUrl, setPic2DataUrl] = useState(null);

  const handleFieldChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handlePicChange = (e, setPicDataUrl) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPicDataUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPicDataUrl(null);
    }
  };

  const getImageType = (dataUrl) => {
    if (!dataUrl) return null;
    if (dataUrl.startsWith("data:image/png")) return "PNG";
    if (
      dataUrl.startsWith("data:image/jpeg") ||
      dataUrl.startsWith("data:image/jpg")
    )
      return "JPEG";
    return "JPEG"; // default fallback
  };

  const generatePDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();

    const margin = 20;
    const yStart = 30;
    const colWidth = (pageWidth - margin * 2) / 2;
    const rowHeight = 10;

    // Title top center
    pdf.setFontSize(18);
    pdf.text(
      title || "Untitled Report",
      pageWidth / 2,
      20,
      null,
      null,
      "center",
    );

    pdf.setFontSize(12);

    // Draw table border lines
    const numRows = 4;
    const numCols = 2;

    // Horizontal lines
    for (let i = 0; i <= numRows; i++) {
      pdf.line(
        margin,
        yStart + i * rowHeight,
        margin + colWidth * numCols,
        yStart + i * rowHeight,
      );
    }

    // Vertical lines
    for (let j = 0; j <= numCols; j++) {
      pdf.line(
        margin + j * colWidth,
        yStart,
        margin + j * colWidth,
        yStart + rowHeight * numRows,
      );
    }

    // Prepare fields text in two columns
    const leftFields = [
      `1. Cost Center: ${fields.costCenter}`,
      `2. Purpose: ${fields.purpose}`,
      `3. User: ${fields.user}`,
      `4. Location: ${fields.location}`,
    ];
    const rightFields = [
      `5. Brand: ${fields.brand}`,
      `6. Model: ${fields.model}`,
      `7. Type: ${fields.type}`,
      `8. Year: ${fields.year}`,
    ];

    const cellPadding = 3;
    for (let i = 0; i < numRows; i++) {
      pdf.text(
        leftFields[i],
        margin + cellPadding,
        yStart + (i + 0.7) * rowHeight,
      );
      pdf.text(
        rightFields[i],
        margin + colWidth + cellPadding,
        yStart + (i + 0.7) * rowHeight,
      );
    }

    // Add images below the table
    let imgY = yStart + rowHeight * numRows + 20;
    const imgMaxWidth = 80;
    const imgMaxHeight = 60;

    if (pic1DataUrl) {
      pdf.text("Pic1:", margin, imgY - 5);
      const type1 = getImageType(pic1DataUrl);
      pdf.addImage(pic1DataUrl, type1, margin, imgY, imgMaxWidth, imgMaxHeight);
    } else {
      pdf.text("Pic1: No file selected", margin, imgY + 10);
    }

    if (pic2DataUrl) {
      const secondImgX = margin + imgMaxWidth + 20;
      pdf.text("Pic2:", secondImgX, imgY - 5);
      const type2 = getImageType(pic2DataUrl);
      pdf.addImage(
        pic2DataUrl,
        type2,
        secondImgX,
        imgY,
        imgMaxWidth,
        imgMaxHeight,
      );
    } else {
      pdf.text("Pic2: No file selected", margin + imgMaxWidth + 20, imgY + 10);
    }

    pdf.save("report.pdf");
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2 style={{ textAlign: "center" }}>Simple Report Generator</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8, fontSize: 16 }}
      />

      {[
        { label: "Cost Center", name: "costCenter" },
        { label: "Purpose", name: "purpose" },
        { label: "User", name: "user" },
        { label: "Location", name: "location" },
        { label: "Brand", name: "brand" },
        { label: "Model", name: "model" },
        { label: "Type", name: "type" },
        { label: "Year", name: "year" },
      ].map(({ label, name }) => (
        <input
          key={name}
          name={name}
          placeholder={label}
          value={fields[name]}
          onChange={handleFieldChange}
          style={{
            width: "100%",
            marginBottom: 10,
            padding: 8,
            fontSize: 16,
            boxSizing: "border-box",
          }}
        />
      ))}

      <div style={{ marginBottom: 10 }}>
        <label>
          Pic 1:{" "}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handlePicChange(e, setPic1DataUrl)}
          />
        </label>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>
          Pic 2:{" "}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handlePicChange(e, setPic2DataUrl)}
          />
        </label>
      </div>

      <button
        onClick={generatePDF}
        style={{
          width: "100%",
          padding: 12,
          fontSize: 16,
          backgroundColor: "#3498db",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        Generate PDF
      </button>
    </div>
  );
}
