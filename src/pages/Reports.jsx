import React, { useState } from "react";
import { reactAppBackendUrl } from "../env/envoriment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import "./Reports.css";
const Reports = () => {
  const [isLoading, setIsLoading] = useState(false);

  const downloadReport = async (format) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${reactAppBackendUrl}/reports/${format}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const blob = new Blob([response.data], {
        type:
          format === "pdf"
            ? "application/pdf"
            : format === "csv"
              ? "text/csv"
              : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      setIsLoading(false);
      console.error("Erro ao baixar relatório", error);
    }
  };

  return (
    <div className="reports-container">
      <h1>Relatórios de tarefas</h1>
      <p>Selecione o formato de relatório</p>
      <div className="reports">
        <button
          className="download-button"
          onClick={() => downloadReport("pdf")}
          disabled={isLoading}
        >
          PDF
          {isLoading && <FontAwesomeIcon icon={faSpinner} spin />}
        </button>
        <button
          className="download-button"
          onClick={() => downloadReport("csv")}
          disabled={isLoading}
        >
          CSV
          {isLoading && <FontAwesomeIcon icon={faSpinner} spin />}
        </button>
        <button
          className="download-button"
          onClick={() => downloadReport("excel")}
          disabled={isLoading}
        >
          Excel
          {isLoading && <FontAwesomeIcon icon={faSpinner} spin />}
        </button>
      </div>
    </div>
  );
};

export default Reports;
