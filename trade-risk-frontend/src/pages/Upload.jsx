import { useState } from "react";
import { uploadCSV } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setStatus("Processing dataset...");
      await uploadCSV(formData);

      setStatus("Dataset successfully analyzed.");
      setTimeout(() => navigate("/"), 1500);
    } catch {
      setStatus("Upload failed. Please verify file format.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">

      {/* ================= HERO ================= */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold">
          Data Ingestion & Risk Analysis
        </h1>
        <p className="text-gray-400 mt-2 text-sm">
          Upload trade transaction datasets for hybrid AI risk evaluation.
        </p>
      </div>

      {/* ================= UPLOAD CARD ================= */}
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg space-y-6">

        <div className="border-2 border-dashed border-gray-700 rounded-xl p-10 text-center hover:border-blue-500 transition">
          <p className="text-gray-400 text-sm mb-3">
            Select CSV file containing trade transactions
          </p>

          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm"
          />

          {file && (
            <p className="mt-4 text-xs text-gray-500">
              Selected file: {file.name}
            </p>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className={`w-full py-3 rounded-lg font-medium transition ${
            loading
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Analyzing..." : "Run Hybrid Risk Analysis"}
        </button>

        {status && (
          <div className="text-sm text-gray-400 border-t border-gray-800 pt-4">
            {status}
          </div>
        )}
      </div>

      {/* ================= INFO PANEL ================= */}
      <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
          Processing Overview
        </p>

        <ul className="text-sm text-gray-400 space-y-2">
          <li>• AI anomaly detection via Isolation Forest</li>
          <li>• Statistical deviation scoring (Z-Score)</li>
          <li>• Rule-based compliance validation</li>
          <li>• Contextual frequency adjustment</li>
          <li>• Explainable risk interpretation engine</li>
        </ul>
      </div>

    </div>
  );
}